<?php
// app/Http/Controllers/Api/AccidentController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accident;
use App\Http\Resources\AccidentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Cache; 

class AccidentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            // ✅ تم تعديل التحقق من camera_id ليناسب النوع الرقمي
            'camera_id' => 'required|integer|exists:cameras,camera_id', 
            'timestamp' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $accident = Accident::create($validator->validated());

        return response()->json([
            'message' => 'Accident recorded successfully.',
            'id' => $accident->id
        ], 201);
    }

    public function indexAll()
    {
        $allAccidents = Cache::remember('all_accidents_24h', now()->addMinutes(10), function () {
            return Accident::with('camera')
                ->where('created_at', '>=', now()->subHours(24)) 
                ->latest()
                ->get();
        });

        return AccidentResource::collection($allAccidents);
    }
    
    public function markAsViewed(Accident $accident): AccidentResource
    {
        $accident->status = 'viewed';
        $accident->save();
        
        return new AccidentResource($accident->load('camera'));
    }

    /**
     * ✅ تم تعديل هذه الدالة بالكامل لتعمل مع الكاش
     * Stream new accidents in real-time by polling the cache.
     */
   public function streamNewAccidents(): StreamedResponse
    {
        $response = new StreamedResponse(function() {
            while (true) {
                // 1. اقرأ آخر حادث من الكاش
                $latestAccident = Cache::get('latest_accident');

                // 2. تحقق فقط إذا كان هناك حادث جديد
                if ($latestAccident) {
                    
                    $accidentResource = new AccidentResource($latestAccident);

                    // 3. أرسل الحدث إلى المتصفح
                    echo "event: new-accident\n";
                    echo 'data: ' . $accidentResource->toJson() . "\n\n";

                    ob_flush();
                    flush();

                    // 4. ✅ الأهم: احذف الحادث من الكاش فوراً بعد إرساله
                    Cache::forget('latest_accident');
                }

                // انتظر لمدة ثانيتين قبل المحاولة مرة أخرى
                sleep(2);

                if (connection_aborted()) {
                    break;
                }
            }
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Cache-Control', 'no-cache');
        
        return $response;
    }
}
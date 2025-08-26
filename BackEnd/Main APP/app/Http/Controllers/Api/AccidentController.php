<?php

namespace App\Http\Controllers\Api;

use App\Events\AccidentAcknowledged;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccidentRequest;
use App\Http\Resources\AccidentResource;
use App\Models\Accident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AccidentController extends Controller
{
    public function store(StoreAccidentRequest $request): JsonResponse
    {
        $accident = Accident::create($request->validated());

        // <<< الخطوة 1: إضافة الحادث الجديد إلى الكاش ليتمكن الـ Stream من التقاطه
        Cache::put('latest_accident', $accident, now()->addMinutes(1));

        return response()->json([
            'message' => 'Accident recorded successfully.',
            'id' => $accident->id,
        ], 201);
    }

    /**
     * Mark an accident as acknowledged by an employee.
     */
    public function acknowledge(Request $request, Accident $accident): JsonResponse
    {
        if ($accident->status !== 'new') {
            return response()->json(['message' => 'This accident has already been handled.'], 409); // Conflict
        }

        $accident->update([
            'status' => 'acknowledged',
            'claimed_by' => $request->user()->user_id,
            'claimed_at' => now(),
        ]);

        Cache::put('latest_acknowledged_accident', $accident, now()->addMinutes(1));
        event(new AccidentAcknowledged($accident));

        return response()->json([
            'data' => new AccidentResource($accident),
        ]);
    }

    /**
     * Stream new and acknowledged accidents in real-time using SSE.
     */
    public function streamNewAccidents(Request $request): StreamedResponse // <<< يمكن إضافة Request هنا للمصادقة
    {
        // <<< يمكنك إضافة تحقق من التوكن هنا إذا أرسلته كـ query parameter
        // if (!$request->hasValidSignature()) {
        //    abort(401);
        // }
        
        $response = new StreamedResponse(function () {
            set_time_limit(0);

            // <<< الخطوة 2: إضافة عداد للـ Heartbeat
            $counter = 0;

            while (true) {
                if ($latestAccident = Cache::get('latest_accident')) {
                    echo "event: new-accident\n";
                    echo 'data: '.(new AccidentResource($latestAccident))->toJson()."\n\n";
                    Cache::forget('latest_accident');
                }

                if ($acknowledgedAccident = Cache::get('latest_acknowledged_accident')) {
                    echo "event: accident-acknowledged\n";
                    echo 'data: '.json_encode(['id' => $acknowledgedAccident->id])."\n\n";
                    Cache::forget('latest_acknowledged_accident');
                }
                
                // <<< الخطوة 2: إرسال Heartbeat كل 15 ثانية لإبقاء الاتصال مفتوحاً
                if ($counter % 15 == 0) {
                    echo ": keep-alive\n\n";
                }

                ob_flush();
                flush();
                sleep(1);
                $counter++; // <<< زيادة العداد

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

    public function indexAll(Request $request)
    {
        $recentAccidents = Accident::with('camera')
            ->where('timestamp', '>=', now()->subHours(24))
            ->latest()
            ->get();

        return AccidentResource::collection($recentAccidents);
    }
}
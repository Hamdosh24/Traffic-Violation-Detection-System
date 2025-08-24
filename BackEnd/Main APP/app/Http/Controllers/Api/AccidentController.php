<?php

namespace App\Http\Controllers\Api;

use App\Events\AccidentAcknowledged;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccidentRequest; // <-- 1. استيراد الكلاس الجديد
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
        // 3. تم حذف كل كود التحقق والتعامل مع الأخطاء

        $accident = Accident::create($request->validated());

        return response()->json([
            'message' => 'Accident recorded successfully.',
            'id' => $accident->id,
        ], 201);
    }

    /**
     * Get a list of active (new) accidents for the shared task list.
     */

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
            'message' => 'Accident acknowledged successfully.',
            'data' => new AccidentResource($accident),
        ]);
    }

    /**
     * Stream new and acknowledged accidents in real-time using SSE.
     */
    public function streamNewAccidents(): StreamedResponse
    {
        $response = new StreamedResponse(function () {
            set_time_limit(0);
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

                ob_flush();
                flush();
                sleep(1);

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
        // يجلب جميع الحوادث خلال آخر 24 ساعة بدون بيانات الترقيم
        $recentAccidents = Accident::with('camera')
            ->where('timestamp', '>=', now()->subHours(24))
            ->latest()
            ->get();

        return AccidentResource::collection($recentAccidents);
    }
}

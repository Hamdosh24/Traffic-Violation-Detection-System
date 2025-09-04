<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccidentRequest;
use App\Http\Resources\AccidentResource;
use App\Models\Accident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AccidentController extends Controller
{
    /**
     * Store a newly created accident in storage.
     */
    public function store(StoreAccidentRequest $request): JsonResponse
    {
        try {
            $accident = Accident::create($request->validated());

            // دفع الحدث إلى قائمة Redis بدلاً من broadcast
            Redis::rpush('accidents-stream', json_encode([
                'event' => 'new-accident',
                'data' => (new AccidentResource($accident->load('camera')))->resolve(),
            ]));

            return response()->json([
                'message' => 'Accident recorded successfully.',
                'id' => $accident->id,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to record accident: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to record accident.'], 500);
        }
    }

    /**
     * Mark an accident as acknowledged by an employee.
     */
    public function acknowledge(Request $request, Accident $accident): JsonResponse
    {
        $updatedRows = Accident::where('id', $accident->id)
            ->where('status', 'new')
            ->update([
                'status' => 'acknowledged',
                'claimed_by' => $request->user()->id,
                'claimed_at' => now(),
            ]);

        if ($updatedRows === 0) {
            return response()->json(['message' => 'This accident has already been handled.'], 409);
        }

        $updatedAccident = $accident->fresh();

        // دفع الحدث إلى Redis
        Redis::rpush('accidents-stream', json_encode([
            'event' => 'accident-acknowledged',
            'data' => (new AccidentResource($updatedAccident->load('camera')))->resolve(),
        ]));

        return response()->json([
            'data' => new AccidentResource($updatedAccident),
        ]);
    }

    /**
     * Stream new and acknowledged accidents in real-time using SSE.
     */
    public function streamNewAccidents(Request $request): StreamedResponse
    {
        $response = new StreamedResponse(function () {

            // === تعطيل buffering في PHP ===
            if (function_exists('apache_setenv')) {
                @apache_setenv('no-gzip', '1');
                @apache_setenv('dont-vary', '1');
            }
            ini_set('zlib.output_compression', 0);
            ini_set('output_buffering', 0);
            ini_set('implicit_flush', 1);
            ob_implicit_flush(1);
            while (ob_get_level() > 0) {
                ob_end_flush();
            }

            set_time_limit(0);

            while (true) {
                try {
                    $message = Redis::lpop('accidents-stream');

                    if ($message) {
                        $decodedMessage = json_decode($message, true);
                        $eventName = $decodedMessage['event'] ?? 'message';
                        $data = json_encode($decodedMessage['data']);

                        echo "event: {$eventName}\n";
                        echo "data: {$data}\n\n";
                    } else {
                        // heartbeat لإبقاء الاتصال حي
                        echo ": ping\n\n";
                    }

                    @ob_flush();
                    flush();

                    usleep(500000); // نصف ثانية

                } catch (\Exception $e) {
                    Log::error('SSE Error: ' . $e->getMessage());
                    echo "event: error\n";
                    echo 'data: {"message": "Stream connection lost."}' . "\n\n";
                    @ob_flush();
                    flush();
                    break;
                }
            }
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');

        return $response;
    }

    /**
     * Display a listing of accidents from the last 24 hours.
     */
    public function indexAll(Request $request)
    {
        $recentAccidents = Accident::with('camera')
            ->where('timestamp', '>=', now()->subHours(24))
            ->latest('timestamp')
            ->get();

        return AccidentResource::collection($recentAccidents);
    }
}

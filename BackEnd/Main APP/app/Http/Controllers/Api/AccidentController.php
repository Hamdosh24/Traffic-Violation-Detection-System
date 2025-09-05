<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccidentRequest;
use App\Http\Resources\AccidentResource;
use App\Models\Accident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Cache;


class AccidentController extends Controller
{
    public function store(StoreAccidentRequest $request): JsonResponse
{
    try {
        $accident = Accident::create($request->validated());

        // بث مباشر عبر الحدث
        event(new \App\Events\NewAccidentCreated($accident));

        return response()->json([
            'message' => 'Accident recorded successfully.',
            'id' => $accident->id,
        ], 201);

    } catch (\Exception $e) {
        \Log::error('Failed to record accident: ' . $e->getMessage());
        return response()->json(['message' => 'Failed to record accident.'], 500);
    }
}

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

        return response()->json([
            'data' => new AccidentResource($accident->fresh()->load('camera')),
        ]);
    }
public function streamNewAccidents(Request $request): StreamedResponse
{
    $response = new \Symfony\Component\HttpFoundation\StreamedResponse(function () {
        ini_set('zlib.output_compression', 0);
        ini_set('output_buffering', 0);
        ini_set('implicit_flush', 1);
        ob_implicit_flush(1);
        while (ob_get_level() > 0) {
            ob_end_flush();
        }

        set_time_limit(0);

        echo ": connected\n\n";
        @ob_flush();
        flush();

        while (true) {
            try {
                // سحب الحوادث من الكاش وإفراغها مباشرة لتجنب التكرار
                $newAccidents = Cache::pull('new_accidents', []);

                foreach ($newAccidents as $accident) {
                    $data = json_encode(new \App\Http\Resources\AccidentResource($accident));
                    echo "event: new-accident\n";
                    echo "data: {$data}\n\n";
                }

                // heartbeat
                echo ": ping\n\n";

                @ob_flush();
                flush();

                sleep(1);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('SSE Error: ' . $e->getMessage());
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
    public function indexAll(Request $request)
    {
        $recentAccidents = Accident::with('camera')
            ->where('timestamp', '>=', now()->subHours(24))
            ->latest('timestamp')
            ->get();

        return AccidentResource::collection($recentAccidents);
    }
}

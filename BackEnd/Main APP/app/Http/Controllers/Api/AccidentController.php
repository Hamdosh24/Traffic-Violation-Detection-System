<?php

namespace App\Http\Controllers\Api;

use App\Events\AccidentAcknowledged;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccidentRequest;
use App\Http\Resources\AccidentResource;
use App\Models\Accident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Handles all API requests related to accidents.
 * This includes recording new accidents, acknowledging them,
 * and streaming real-time updates.
 */
class AccidentController extends Controller
{
    /**
     * Store a new accident record reported by an external system.
     *
     * @param \App\Http\Requests\StoreAccidentRequest $request The validated request data.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreAccidentRequest $request): JsonResponse
    {
        try {
            // Create the accident record using the validated data from the Form Request.
            $accident = Accident::create($request->validated());

            // Note: The 'NewAccidentCreated' event is fired by the AccidentObserver,
            // which is the correct place for this logic to avoid duplicate events.

            return response()->json([
                'message' => 'Accident recorded successfully.',
                'id' => $accident->id,
            ], 201); // 201 Created

        } catch (\Exception $e) {
            // Log any other unexpected errors during the creation process.
            Log::error('Failed to record accident: ' . $e->getMessage());

            return response()->json(['message' => 'Failed to record accident.'], 500);
        }
    }

    /**
     * Allows an authenticated employee to acknowledge or "claim" an accident.
     *
     * @param \Illuminate\Http\Request $request The incoming request.
     * @param \App\Models\Accident $accident The accident instance from Route Model Binding.
     * @return \Illuminate\Http\JsonResponse
     */
    public function acknowledge(Request $request, Accident $accident): JsonResponse
    {
        // This is an atomic operation to prevent a race condition.
        // It will only update the record if the 'status' is still 'new'.
        $updatedRows = Accident::where('id', $accident->id)
            ->where('status', 'new')
            ->update([
                'status' => 'acknowledged',
                'claimed_by' => $request->user()->id,
                'claimed_at' => now(),
            ]);

        // If updatedRows is 0, it means another user claimed the accident first.
        if ($updatedRows === 0) {
            return response()->json(['message' => 'This accident has already been handled.'], 409); // 409 Conflict
        }

        // Fire an event to notify other clients that this accident has been acknowledged.
        // This is typically broadcasted over WebSockets or pushed to a stream.
        event(new AccidentAcknowledged($accident));

        // Return the updated accident data, including the camera relationship.
        return response()->json([
            'data' => new AccidentResource($accident->fresh()->load('camera')),
        ]);
    }

    /**
     * Creates a Server-Sent Events (SSE) stream to push real-time accident updates.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function streamNewAccidents(Request $request): StreamedResponse
    {
        $response = new StreamedResponse(function () {
            // Close the session to prevent blocking other requests from the same user.
            session_write_close();

            // --- SSE Setup: Configure PHP for a long-running streaming response ---
            ini_set('zlib.output_compression', 0);
            set_time_limit(0); // No time limit for this script.
            ob_implicit_flush(1); // Flush the output buffer automatically.
            // Clean any existing output buffers.
            while (ob_get_level() > 0) {
                ob_end_flush();
            }

            // Send an initial connection confirmation to the client.
            echo ": connected\n\n";
            flush();

            // Indefinite loop to continuously check for and send new messages.
            while (true) {
                try {
                    // ✅ FIX: Use the correct Redis list name to match the listener.
                    while ($payload = Redis::lpop('accidents_stream')) {
                        // This was 'new_accidents_stream' before.
                        
                        $eventData = json_decode($payload, true);

                        // Ensure the payload is valid and has an 'event' key (previously 'type').
                        if ($eventData && isset($eventData['event'])) {
                            // Format the message according to the SSE protocol.
                            echo 'event: ' . $eventData['event'] . "\n";
                            echo 'data: ' . json_encode($eventData['data']) . "\n\n";
                            flush(); // Send the message to the client immediately.
                        }
                    }

                    // Send a heartbeat comment every second to keep the connection alive
                    // and prevent timeouts in proxies or load balancers.
                    echo ": ping\n\n";
                    flush();
                    sleep(1); // Wait for 1 second before checking Redis again.

                } catch (\Exception $e) {
                    Log::error('SSE Error: ' . $e->getMessage());
                    echo "event: error\n";
                    echo 'data: {"message": "Stream connection lost."}' . "\n\n";
                    flush();
                    break; // Exit the loop on error.
                }
            }
        });

        // Set the necessary headers for an SSE connection.
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no'); // Important for Nginx proxying.

        return $response;
    }

    /**
     * Fetches a list of recent accidents.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function indexAll(Request $request)
    {
        $recentAccidents = Accident::with('camera') // Eager load the camera to prevent N+1 query problems.
            ->where('timestamp', '>=', now()->subHours(24)) // Get accidents from the last 24 hours.
            ->latest('timestamp') // Order by the newest first.
            ->get();

        return AccidentResource::collection($recentAccidents);
    }
}


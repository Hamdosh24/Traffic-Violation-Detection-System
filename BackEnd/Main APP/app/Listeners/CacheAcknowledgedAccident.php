<?php

namespace App\Listeners;

use App\Events\AccidentAcknowledged;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

/**
 * Handles the AccidentAcknowledged event by pushing a notification
 * into a Redis list, which acts as a real-time event stream.
 */
class CacheAcknowledgedAccident
{
    /**
     * Handle the event.
     *
     * @param \App\Events\AccidentAcknowledged $event The event instance.
     * @return void
     */
    public function handle(AccidentAcknowledged $event): void
    {
        // Prepare a lightweight JSON payload for the frontend.
        // This payload is structured to be easily parsed by a client-side listener.
        $payload = json_encode([
            'event' => 'accident-acknowledged', // The event name for the frontend to identify the action.
            'data'  => [
                'id'         => $event->accident->id,
                'status'     => 'acknowledged',
                'claimed_by' => $event->accident->claimed_by,
            ],
        ]);

        // Push the update to the stream to be processed by clients.
        // 'rpush' adds the new payload to the end of the 'accidents_stream' list in Redis.
        Redis::rpush('accidents_stream', $payload);

        // Log the action for debugging and monitoring purposes.
        Log::info('Pushed accident-acknowledged event to Redis stream.', ['id' => $event->accident->id]);
    }
}

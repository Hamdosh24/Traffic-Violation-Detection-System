<?php

namespace App\Listeners;

use App\Events\NewAccidentCreated;
use App\Http\Resources\AccidentResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

/**
 * Handles the NewAccidentCreated event by pushing the full accident data
 * into a Redis list, which acts as a real-time event stream.
 */
class CacheNewAccident
{
    /**
     * Handle the event.
     *
     * @param \App\Events\NewAccidentCreated $event The event instance.
     * @return void
     */
    public function handle(NewAccidentCreated $event): void
    {
        // Eager load the 'camera' relationship to include it in the resource payload,
        // preventing extra database queries.
        $accident = $event->accident->load('camera');

        // Use an API Resource to ensure a consistent and controlled data structure for the API.
        $accidentResource = new AccidentResource($accident);

        // Prepare a structured JSON payload for the frontend.
        $payload = json_encode([
            'event' => 'new-accident', // The event name for the frontend listener.
            'data'  => $accidentResource->toArray(request()),
        ]);

        // Push the JSON payload to the end of the 'accidents_stream' Redis list.
        Redis::rpush('accidents_stream', $payload);

        // Log the action for debugging and monitoring.
        Log::info('Pushed new-accident event to Redis stream.', ['id' => $accident->id]);
    }
}

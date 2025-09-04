<?php

namespace App\Events;

use App\Http\Resources\AccidentResource;
use App\Models\Accident;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;

class NewAccidentCreated
{
    use Dispatchable, SerializesModels;

    public Accident $accident;

    public function __construct(Accident $accident)
    {
        $this->accident = $accident;

        // بث الحادث عبر Redis list بدلاً من ShouldBroadcast
        Redis::rpush('accidents-stream', json_encode([
            'event' => 'new-accident',
            'data' => (new AccidentResource($this->accident->load('camera')))->resolve(),
        ]));
    }
}

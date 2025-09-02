<?php

namespace App\Events;

use App\Http\Resources\AccidentResource;
use App\Models\Accident;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewAccidentCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Accident $accident;

    public function __construct(Accident $accident)
    {
        $this->accident = $accident;
    }

    public function broadcastOn(): array
    {
        // القناة التي سيتم بث الحدث عليها
        return [new Channel('accidents-channel')];
    }

    public function broadcastAs(): string
    {
        // اسم الحدث الذي سيستمع له الـ SSE
        return 'new-accident';
    }

    public function broadcastWith(): array
    {
        // البيانات التي سيتم إرسالها
        return (new AccidentResource($this->accident->load('camera')))->resolve();
    }
}
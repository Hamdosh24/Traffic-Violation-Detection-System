<?php

namespace App\Events;

use App\Models\Accident;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AccidentAcknowledged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Accident $accident;

    public function __construct(Accident $accident)
    {
        $this->accident = $accident;
    }

    public function broadcastOn(): array
    {
        return [new Channel('accidents-channel')];
    }

    public function broadcastAs(): string
    {
        // اسم الحدث هنا مختلف
        return 'accident-acknowledged';
    }

    public function broadcastWith(): array
    {
        // نرسل فقط الـ ID كما في الكود الأصلي
        return ['id' => $this->accident->id];
    }
}

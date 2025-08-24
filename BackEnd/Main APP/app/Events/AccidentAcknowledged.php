<?php

namespace App\Events;

use App\Http\Resources\AccidentResource; // سنستخدم الـ Resource لتنسيق البيانات
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

    // تحديد القناة التي سيتم البث عليها (عامة لكل الموظفين)
    public function broadcastOn(): array
    {
        return [new Channel('accidents-channel')];
    }

    // تحديد اسم الحدث الذي سيستمع إليه المتصفح
    public function broadcastAs(): string
    {
        return 'accident.acknowledged';
    }

    // (اختياري ولكن موصى به) تحديد البيانات التي سيتم إرسالها
    public function broadcastWith(): array
    {
        return (new AccidentResource($this->accident))->resolve();
    }
}

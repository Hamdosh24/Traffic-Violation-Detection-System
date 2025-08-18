<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class NotificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // المعلومات الأساسية للإشعار
            'id' => $this->id,
            'message' => $this->data['message'],
            'is_read' => !is_null($this->read_at),
            'read_at' => $this->read_at ? Carbon::parse($this->read_at)->toDateTimeString() : null,
            'created_since' => Carbon::parse($this->created_at)->diffForHumans(), // مثل "منذ 5 دقائق"

            // معلومات الحادث المتعلق بالإشعار
            'accident' => [
                'id' => $this->data['accident_id'],
                'camera_id' => $this->data['camera_id'],
                'timestamp' => Carbon::parse($this->data['timestamp'])->toDateTimeString(),
            ],
        ];
    }
}
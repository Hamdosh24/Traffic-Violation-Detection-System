<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SightingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'p_car_id' => $this->p_car_id,
            'timestamp' => $this->timestamp,
            // إعادة استخدام CameraResource
            'camera' => new CameraResource($this->whenLoaded('camera')),
        ];
    }
}

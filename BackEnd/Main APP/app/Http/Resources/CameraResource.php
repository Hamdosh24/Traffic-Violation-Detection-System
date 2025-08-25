<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CameraResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'camera_id' => $this->camera_id,
            'governorate' => $this->governorate,
            'region' => $this->region,
            'street' => $this->street,
            'coordinates' => $this->coordinates,
        ];
    }
}

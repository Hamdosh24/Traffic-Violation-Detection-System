<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class AccidentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'timestamp' => Carbon::parse($this->timestamp)->toDateTimeString(),
            'status' => $this->status,
            'camera' => new CameraResource($this->whenLoaded('camera')),
        ];
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * A resource for transforming an Accident model into a standard JSON representation.
 *
 * This ensures a consistent structure for accident data across the API.
 */
class AccidentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request The incoming request.
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // The unique ID of the accident.
            'id' => $this->id,

            // Ensure the timestamp is always in a consistent 'Y-m-d H:i:s' format.
            'timestamp' => Carbon::parse($this->timestamp)->toDateTimeString(),

            // The current status of the accident (e.g., 'new', 'acknowledged').
            'status' => $this->status,

            // Embed the related camera information.
            // This will only be included if the 'camera' relationship was eager-loaded.
            'camera' => new CameraResource($this->whenLoaded('camera')),
        ];
    }
}

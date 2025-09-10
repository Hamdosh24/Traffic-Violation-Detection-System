<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A resource for transforming a PassingCar model into a JSON representation for a "sighting".
 *
 * This is used when displaying search results for a specific plate number.
 */
class SightingResource extends JsonResource
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
            // The unique ID of the passing car record.
            'p_car_id' => $this->p_car_id,

            // The timestamp of when the car was sighted.
            'timestamp' => $this->timestamp,

            // Embed the camera information using another resource.
            // The 'camera' data will only be included if it was eager-loaded
            // using `->with('camera')` to prevent extra database queries.
            'camera' => new CameraResource($this->whenLoaded('camera')),
        ];
    }
}

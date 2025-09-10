<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A reusable resource for transforming a Camera model into a JSON representation.
 *
 * This can be nested within other resources like AccidentResource and SightingResource.
 */
class CameraResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request The incoming request.
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Map the model's attributes to the desired JSON keys.
        return [
            'camera_id'   => $this->camera_id,
            'governorate' => $this->governorate,
            'region'      => $this->region,
            'street'      => $this->street,
            'coordinates' => $this->coordinates,
        ];
    }
}

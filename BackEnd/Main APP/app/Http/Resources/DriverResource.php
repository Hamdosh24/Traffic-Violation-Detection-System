<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A resource for transforming driver information into a JSON representation.
 *
 * NOTE: This resource is designed to work with an associative array,
 * likely from an external API response, not an Eloquent model.
 */
class DriverResource extends JsonResource
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
            // Note: We use array access `['key']` because the underlying resource is an array.
            // If it were an Eloquent model, we would use object access `->key`.
            'full_name' => $this['first_name'] . ' ' . $this['last_name'],
            'phone_num' => $this['phone_num'],
            'plate_num' => $this['plate_num'],
        ];
    }
}

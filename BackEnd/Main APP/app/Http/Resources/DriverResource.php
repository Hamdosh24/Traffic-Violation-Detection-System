<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DriverResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // التعديل: تم تغيير طريقة الوصول من -> إلى [] لتناسب المصفوفات
            'full_name' => $this['first_name'] . ' ' . $this['last_name'],
            'phone_num' => $this['phone_num'],
            'plate_num' => $this['plate_num'],
        ];
    }
}

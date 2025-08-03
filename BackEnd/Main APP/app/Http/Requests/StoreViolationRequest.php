<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreViolationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // اسمح للجميع بتنفيذ هذا الطلب (يمكن تعديلها لاحقاً)
    }

    public function rules(): array
{
    return [
        'violation_type_key' => 'required|string|exists:violation_types,key',
        'plate_number'       => 'required|string|max:255',
        'timestamp'          => 'required|date',
        // Update this rule
        'camera_id'          => 'required|integer|exists:cameras,camera_id',
    ];
}
}
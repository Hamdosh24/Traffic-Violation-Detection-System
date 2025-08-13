<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreViolationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // اسمح لجميع الطلبات بالمرور في هذه الحالة
        return true; 
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        // انقل جميع القواعد التي كانت في الـ Controller إلى هنا
        return [
            'violation_type_key' => 'required|string|exists:violation_types,key',
            'plate_number'       => 'required|string|max:255',
            'timestamp'          => 'required|date',
            'camera_id'          => 'required|string|exists:cameras,camera_id',
        ];
    }
}
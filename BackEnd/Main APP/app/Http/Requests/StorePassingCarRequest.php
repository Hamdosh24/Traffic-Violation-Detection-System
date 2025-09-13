<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePassingCarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // بما أن صلاحية الوصول تتم عبر Middleware على الـ Route، نضع هنا true
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'plate_num' => 'required|string|max:255',
            'camera_id' => 'required|string|max:255|exists:cameras,camera_id',
            'timestamp' => 'required|date',
        ];
    }
}

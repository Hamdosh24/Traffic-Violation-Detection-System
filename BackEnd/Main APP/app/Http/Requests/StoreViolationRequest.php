<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Handles the validation rules for the request to store a new violation.
 *
 * This class centralizes the validation and authorization logic, keeping the
 * controller clean and the logic reusable.
 */
class StoreViolationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // For now, we allow anyone to submit a violation.
        // In a real application, you might check if the request is coming
        // from a trusted source or an authenticated user.
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
            // The violation type's unique key must exist in the 'violation_types' table.
            'violation_type_key' => 'required|string|exists:violation_types,key',

            // The vehicle's license plate number.
            'plate_number' => 'required|string|max:255',

            // The timestamp of when the violation occurred. Must be a valid date format.
            'timestamp' => 'required|date',

            // The camera's ID must exist in the 'cameras' table.
            'camera_id' => 'required|string|exists:cameras,camera_id',
        ];
    }
}

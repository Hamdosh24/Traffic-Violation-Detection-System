<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Handles the validation for the request to store a new passing car record.
 *
 * This class isolates the validation logic from the controller,
 * making the controller cleaner and the validation rules reusable.
 */
class StorePassingCarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        // Authorization is handled by the middleware on the route itself (e.g., API key check).
        // Therefore, we can safely return true here.
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
            // 'plate_num' must be present, a string, and not exceed 255 characters.
            'plate_num' => 'required|string|max:255',

            // 'camera_id' must be present, a string, not exceed 255 characters,
            // and its value MUST exist in the 'camera_id' column of the 'cameras' table.
            // This prevents recording data from an unknown camera.
            'camera_id' => 'required|string|max:255|exists:cameras,camera_id',

            // 'timestamp' must be present and must be a valid date format.
            'timestamp' => 'required|date',
        ];
    }
}

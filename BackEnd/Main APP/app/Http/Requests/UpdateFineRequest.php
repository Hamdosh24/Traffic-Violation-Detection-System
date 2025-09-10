<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Handles validation for the webhook request that updates a violation's fine amount.
 */
class UpdateFineRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * In a real-world webhook, you would add security checks here,
     * such as verifying a secret token or a signature in the request header.
     */
    public function authorize(): bool
    {
        // For now, we allow the request to pass.
        // Implement webhook security validation.
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
            // The key must exist in our violation_types table to be valid.
            'key' => 'required|string|exists:violation_types,key',

            // The fine amount must be a number and cannot be negative.
            'fine_amount' => 'required|numeric|min:0',
        ];
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateFineRequest;
use App\Models\ViolationType;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

/**
 * Handles incoming webhook calls from external systems.
 */
class WebhookController extends Controller
{
    /**
     * Receives and processes fine amount updates from an external system.
     *
     * @param  \App\Http\Requests\UpdateFineRequest  $request  The validated request.
     */
    public function handleFineUpdate(UpdateFineRequest $request): JsonResponse
    {
        // Step 1: Data is already validated by UpdateFineRequest.
        $validatedData = $request->validated();

        // Step 2: Find the corresponding violation type.
        // We can use `firstOrFail` or a simple `first` since the `exists` rule
        // in our Form Request already guarantees it will be found.
        $violationType = ViolationType::where('key', $validatedData['key'])->first();

        // Step 3: Update the fine amount and save it.
        // Best Practice: Store monetary values in the smallest currency unit (e.g., cents, hellalas).
        $violationType->fine_amount = $validatedData['fine_amount'] * 100;
        $violationType->save();

        // Step 4: Log the successful operation for auditing purposes.
        Log::info("Webhook: Fine amount for key '{$validatedData['key']}' was updated.", [
            'new_value_in_hellalas' => $violationType->fine_amount,
        ]);

        // Step 5: Return a success response to the external system.
        return response()->json([
            'status' => 'success',
            'message' => 'Violation fine amount updated successfully.',
        ], 200); // 200 OK
    }
}

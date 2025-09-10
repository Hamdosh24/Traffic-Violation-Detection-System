<?php

namespace App\Http\Controllers\Api;

use App\Events\ViolationRecorded;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreViolationRequest;
use App\Models\Violation;
use App\Models\ViolationType;
use App\Services\TrafficAPIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Handles incoming API requests related to traffic violations.
 */
class ViolationController extends Controller
{
    /**
     * Store a new violation record.
     *
     * This method validates the incoming request, fetches driver information from an
     * external service, creates the violation record, and then dispatches an event
     * for background processing (like sending notifications).
     *
     * @param  \App\Http\Requests\StoreViolationRequest  $request  The validated request object.
     * @param  \App\Services\TrafficAPIService  $trafficService  The service for interacting with the external traffic API.
     */
    public function store(StoreViolationRequest $request, TrafficAPIService $trafficService): JsonResponse
    {
        $driverInfo = null;

        // Step 1: Attempt to get driver info from the external Traffic API.
        try {
            $driverInfo = $trafficService->getDriverInfoByPlate($request->plate_number);
        } catch (Throwable $e) {
            // Gracefully handle external API failures without crashing the application.
            Log::error('External Traffic API call failed.', [
                'plate_number' => $request->plate_number,
                'error' => $e->getMessage(),
            ]);
        }

        // Step 2: If the API call failed or returned no data, provide a default structure.
        // This ensures the rest of the application (e.g., event listeners)
        // receives a consistent data structure and does not fail.
        if ($driverInfo === null) {
            Log::warning("Driver info not found for plate: {$request->plate_number}. Proceeding without it.");
            $driverInfo = $this->getEmptyDriverInfo();
        }

        // Step 3: Fetch the ViolationType model based on the validated key.
        // We can trust `first()` here because the `exists` rule in StoreViolationRequest
        // has already confirmed that this key is valid.
        $violationType = ViolationType::where('key', $request->violation_type_key)->first();

        // Step 4: Create the violation record in the database.
        $violation = Violation::create([
            'v_type_id' => $violationType->v_type_id,
            'camera_id' => $request->camera_id,
            'plate_num' => $request->plate_number,
            'timestamp' => $request->timestamp,
        ]);

        // Step 5: "Fire and forget" the event with all necessary data.
        // The controller's job is done. Background listeners will handle notifications.
        event(new ViolationRecorded($violation, $driverInfo));

        // Step 6: Return a minimal, successful response to the API client.
        return response()->json([
            'message' => 'Violation recorded successfully.',
            'v_id' => $violation->v_id,
        ], 201); // 201 Created is the standard HTTP status for successful resource creation.
    }

    /**
     * Provides a default, empty structure for driver information.
     *
     * @return array<string, null>
     */
    private function getEmptyDriverInfo(): array
    {
        return [
            'first_name' => null,
            'last_name' => null,
            'email' => null,
            'license_no' => null,
        ];
    }
}

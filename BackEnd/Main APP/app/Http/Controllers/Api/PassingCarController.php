<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePassingCarRequest;
use App\Http\Resources\DriverResource;
use App\Http\Resources\SightingResource;
use App\Models\ActivityLog;
use App\Models\PassingCar;
use App\Services\TrafficAPIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * Handles API requests related to passing cars.
 */
class PassingCarController extends Controller
{
    /**
     * Store a newly created passing car record.
     * This is typically called by an automated system like an AI camera.
     *
     * @param \App\Http\Requests\StorePassingCarRequest $request The validated request data.
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StorePassingCarRequest $request): JsonResponse
    {
        // The validation is handled by the StorePassingCarRequest class.
        $passingCar = PassingCar::create($request->validated());

        return response()->json([
            'message' => 'Passing car recorded successfully.',
            'p_car_id' => $passingCar->p_car_id,
        ], 201); // 201 Created
    }

    /**
     * Search for a plate number, fetching both external driver info and local sightings.
     * This is typically called by an employee from the frontend application.
     *
     * @param string $plate_num The plate number to search for.
     * @param \App\Services\TrafficAPIService $trafficService The service for the external API.
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchByPlate(string $plate_num, TrafficAPIService $trafficService): JsonResponse
    {
        // Step 1: Attempt to get the driver's info from the external Traffic API service.
        try {
            $driverInfo = $trafficService->getDriverInfoByPlate($plate_num);
        } catch (\Exception $e) {
            Log::error('Traffic API search failed critically: ' . $e->getMessage(), ['plate' => $plate_num]);

            // Return a 503 Service Unavailable error if the external API call fails.
            return response()->json(['message' => 'Could not connect to the traffic service.'], 503);
        }

        // Step 2: Get all local sightings for this plate number from the last 48 hours.
        // Eager-loading 'camera' prevents the N+1 query problem in the SightingResource.
        $sightings = PassingCar::with('camera')
            ->where('plate_num', $plate_num)
            ->where('timestamp', '>=', now()->subHours(48)) // Filter for recent data
            ->latest('timestamp') // Order by the most recent sighting first
            ->get();

        // Step 3: Log this search action for auditing and security purposes.
        ActivityLog::create([
            'user_id' => Auth::id(), // The ID of the employee who performed the search.
            'action_type' => 'Plate Search',
            'description' => "Searched for driver info and sightings for plate: {$plate_num}",
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        // Step 4: Construct the final response based on whether the driver was found.
        $responseData = [];

        if (empty($driverInfo)) {
            // Case: Driver was NOT found in the external API.
            $responseData = [
                'driver_info' => null, // Explicitly set to null.
                'sightings' => SightingResource::collection($sightings),
            ];
        } else {
            // Case: Driver WAS found.
            $responseData = [
                'driver_info' => new DriverResource($driverInfo), // Format using DriverResource.
                'sightings' => SightingResource::collection($sightings), // Format using SightingResource.
            ];
        }

        // Step 5: Return the unified response structure with a 200 OK status.
        return response()->json($responseData, 200);
    }
}

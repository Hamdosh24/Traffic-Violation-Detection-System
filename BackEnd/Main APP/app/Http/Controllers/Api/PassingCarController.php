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

class PassingCarController extends Controller
{
    /**
     * Store a newly created passing car record.
     * (This method remains unchanged)
     */
    public function store(StorePassingCarRequest $request): JsonResponse
    {
        $passingCar = PassingCar::create($request->validated());

        return response()->json([
            'message' => 'Passing car recorded successfully.',
            'p_car_id' => $passingCar->p_car_id,
        ], 201);
    }

    /**
     * Search for a plate number and return its history with a unified response structure.
     * Called by the frontend.
     * ✅ THIS IS THE UPDATED METHOD
     */
    public function searchByPlate(string $plate_num, TrafficAPIService $trafficService): JsonResponse
    {
        // 1. Get driver's info from external API (no changes here)
        try {
            $driverInfo = $trafficService->getDriverInfoByPlate($plate_num);
        } catch (\Exception $e) {
            Log::error('Traffic API search failed critically: '.$e->getMessage(), ['plate' => $plate_num]);

            return response()->json(['message' => 'Could not connect to the traffic service.'], 503);
        }

        // 2. Check for service failure (no changes here)
        if ($driverInfo === null) {
            return response()->json(['message' => 'The traffic service is currently unavailable.'], 503);
        }

        // 3. Get all sightings from our local database (no changes here)
        $sightings = PassingCar::with('camera')
            ->where('plate_num', $plate_num)
            ->latest('timestamp')
            ->get();

        // 4. Log the search activity (no changes here)
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action_type' => 'بحث عن لوحة',
            'description' => "تم البحث عن معلومات السائق والمشاهدات للوحة رقم {$plate_num}",
            'model_type' => 'PassingCar',
            'model_id' => null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        $responseData = [];

        if (empty($driverInfo)) {
            // Case: Driver NOT found
            $responseData = [
                'data' => [
                    'driver_info' => null, // Set driver_info to null
                    'sightings' => SightingResource::collection($sightings),
                ],
            ];
        } else {
            // Case: Driver IS found ("Happy Path")
            $responseData = [
                'data' => [
                    'driver_info' => new DriverResource($driverInfo),
                    'sightings' => SightingResource::collection($sightings),
                ],
            ];
        }

        // 6. ✅ Return the single, unified response structure with a 200 OK status
        return response()->json($responseData, 200);
    }
}

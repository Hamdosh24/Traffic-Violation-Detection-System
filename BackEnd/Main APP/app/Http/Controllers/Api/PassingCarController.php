<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PassingCar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use App\Services\TrafficAPIService; // 1. Import services
use App\Services\CameraAPIService;

class PassingCarController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // ... (your existing store method remains the same)
        $validator = Validator::make($request->all(), [
            'plate_num' => 'required|string|max:255',
            'camera_id' => 'required|string|max:255',
            'timestamp' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $passingCar = PassingCar::create($validator->validated());

        return response()->json($passingCar, 201);
    }

    /**
     * Search for passing car records and enrich them with driver and camera info.
     */
    public function searchByPlate(
        string $plate_num,
        TrafficAPIService $trafficService,
        CameraAPIService $cameraService
    ): JsonResponse {
        // Step 1: Get the driver's information from the mock API
        $driverInfo = $trafficService->getDriverInfoByPlate($plate_num);

        if (!$driverInfo) {
            return response()->json(['message' => 'Driver with this plate number was not found.'], 404);
        }

        // Step 2: Get all sightings for this car from your local database
        $sightings = PassingCar::where('plate_num', $plate_num)
                                ->latest('timestamp')
                                ->get();

        // Step 3 (Efficient): Get all camera info from the mock API once
        $allCameras = $cameraService->getAllCameras();
        $cameraMap = collect($allCameras)->keyBy('camera_id'); // Create a map for fast lookups

        // Step 4: Combine the sightings with the camera details
        $enrichedSightings = $sightings->map(function ($sighting) use ($cameraMap) {
            return [
                'sighting_details' => $sighting,
                'camera_info' => $cameraMap[$sighting->camera_id] ?? null,
            ];
        });

        // Step 5: Structure the final response
        $data = [
            'driver_info' => $driverInfo,
            'sightings' => $enrichedSightings,
        ];

        return response()->json($data);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accident;
use App\Services\CameraAPIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;

class AccidentController extends Controller
{
    /**
     * Store a newly created accident in storage.
     */
    public function store(Request $request, CameraAPIService $cameraService): JsonResponse
    {
        // ... (your store method remains the same)
        $validator = Validator::make($request->all(), [
            'camera_id' => 'required|string|max:255',
            'timestamp' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cameraInfo = $cameraService->getCameraById($request->input('camera_id'));
        if (!$cameraInfo) {
            return response()->json(['message' => 'معرّف الكاميرا المدخل غير موجود في النظام.'], 422);
        }

        $accident = Accident::create($validator->validated());

        $data = [
            'accident' => $accident,
            'camera_info' => $cameraInfo,
        ];

        return response()->json($data, 201);
    }

    /**
     * Get all new accidents and enrich them with camera info.
     */
    public function indexNew(CameraAPIService $cameraService): JsonResponse
    {
        // Step 1: Get all new accidents from your local database
        $newAccidents = Accident::where('status', 'new')->latest()->get();

        if ($newAccidents->isEmpty()) {
            return response()->json([]); // Return an empty array if there are no new accidents
        }

        // Step 2 (Efficient): Get all camera info from the mock API in a single call
        $allCameras = $cameraService->getAllCameras();
        // Create a map for fast lookups, using camera_id as the key
        $cameraMap = collect($allCameras)->keyBy('camera_id');

        // Step 3: Combine the accident data with the camera data
        $enrichedAccidents = $newAccidents->map(function ($accident) use ($cameraMap) {
            return [
                'accident' => $accident,
                'camera_info' => $cameraMap->get($accident->camera_id), // Find the camera in the map
            ];
        });

        // Step 4: Return the final, enriched list
        return response()->json($enrichedAccidents);
    }

    /**
     * Mark an accident's notification as viewed.
     */
    public function markAsViewed(Accident $accident): JsonResponse
    {
        // ... (your markAsViewed method remains the same)
        $accident->status = 'viewed';
        $accident->save();
        return response()->json($accident);
    }
}
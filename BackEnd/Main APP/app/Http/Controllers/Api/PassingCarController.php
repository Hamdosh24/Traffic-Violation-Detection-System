<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PassingCar;
use App\Services\TrafficAPIService;
use App\Http\Resources\SightingResource;
use App\Http\Resources\DriverResource; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\ActivityLog;

class PassingCarController extends Controller
{
    /**
     * Store a newly created passing car record.
     * Called by the AI system.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'plate_num' => 'required|string|max:255',
            'camera_id' => 'required|string|max:255|exists:cameras,camera_id',
            'timestamp' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $passingCar = PassingCar::create($validator->validated());

        // Optimized response for the AI system
        return response()->json([
            'message' => 'Passing car recorded successfully.',
            'p_car_id' => $passingCar->p_car_id
        ], 201);
    }

    /**
     * Search for a plate number and return its history.
     * Called by the frontend.
     */
    public function searchByPlate(string $plate_num, TrafficAPIService $trafficService): JsonResponse
    {
        // 1. Get driver's info from external API
        try {
            $driverInfo = $trafficService->getDriverInfoByPlate($plate_num);
            if (!$driverInfo) {
                return response()->json(['message' => 'Driver with this plate number was not found.'], 404);
            }
        } catch (\Exception $e) {
            Log::error('Traffic API search failed: ' . $e->getMessage());
            return response()->json(['message' => 'Could not connect to the traffic service.'], 503);
        }

        // 2. Get all sightings from our database, with camera info
        $sightings = PassingCar::with('camera')
                                ->where('plate_num', $plate_num)
                                ->latest('timestamp')
                                ->get();
        
        // 3. Log the search activity
        ActivityLog::create([
            'user_id'     => Auth::id(),
            'action_type' => 'بحث عن لوحة',
            'description' => "تم البحث عن معلومات السائق والمشاهدات للوحة رقم {$plate_num}",
            'model_type'  => 'PassingCar',
            'model_id'    => null,
            'ip_address'  => request()->ip(),
            'user_agent'  => request()->userAgent(),
        ]);

        // 4. Return the structured response using the resource
        return response()->json([
            // التعديل 2: تم تطبيق Resource على معلومات السائق
            'driver_info' => new DriverResource($driverInfo),
            'sightings'   => SightingResource::collection($sightings),
        ]);
    }
}

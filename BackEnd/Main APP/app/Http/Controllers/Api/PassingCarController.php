<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePassingCarRequest;
use App\Http\Resources\DriverResource;
use App\Http\Resources\SightingResource;
use App\Models\ActivityLog;
use App\Models\PassingCar;
use App\Services\TrafficAPIService; // <-- 1. استيراد الكلاس الجديد
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PassingCarController extends Controller
{
    /**
     * Store a newly created passing car record.
     * Called by the AI system.
     * (This method remains unchanged)
     */
    public function store(StorePassingCarRequest $request): JsonResponse
    {
        // 3. تم حذف كل كود التحقق والتعامل مع الأخطاء من هنا

        $passingCar = PassingCar::create($request->validated());

        return response()->json([
            'message' => 'Passing car recorded successfully.',
            'p_car_id' => $passingCar->p_car_id,
        ], 201);
    }

    /**
     * Search for a plate number and return its history.
     * Called by the frontend.
     * ✅ This is the updated and corrected method.
     */
    public function searchByPlate(string $plate_num, TrafficAPIService $trafficService): JsonResponse
    {
        // 1. Get driver's info from external API with robust error handling
        try {
            $driverInfo = $trafficService->getDriverInfoByPlate($plate_num);
        } catch (\Exception $e) {
            // This catches critical connection errors (e.g., timeout)
            Log::error('Traffic API search failed critically: '.$e->getMessage(), ['plate' => $plate_num]);

            return response()->json(['message' => 'Could not connect to the traffic service.'], 503); // 503 Service Unavailable
        }

        // 2. Check if the service itself returned a failure signal (null)
        if ($driverInfo === null) {
            return response()->json(['message' => 'The traffic service is currently unavailable.'], 503);
        }

        // 3. Get all sightings from our local database
        $sightings = PassingCar::with('camera')
            ->where('plate_num', $plate_num)
            ->latest('timestamp')
            ->get();

        // 4. Log the search activity
        ActivityLog::create([
            'user_id' => Auth::id(),
            'action_type' => 'بحث عن لوحة',
            'description' => "تم البحث عن معلومات السائق والمشاهدات للوحة رقم {$plate_num}",
            'model_type' => 'PassingCar',
            'model_id' => null, // Can be improved later as discussed
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);

        // 5. Check if the driver was specifically not found (empty result)
        if (empty($driverInfo)) {
<<<<<<< Updated upstream
            return response()->json([
                'message' => 'Driver with this plate number was not found.',
                'sightings' => SightingResource::collection($sightings), // Still return local sightings
            ], 404); // 404 Not Found
=======
            // Case: Driver NOT found
            $responseData = [
                    'driver_info' => null, // Set driver_info to null
                    'sightings' => SightingResource::collection($sightings),
            ];
        } else {
            // Case: Driver IS found ("Happy Path")
            $responseData = [
                    'driver_info' => new DriverResource($driverInfo),
                    'sightings' => SightingResource::collection($sightings),
            ];
>>>>>>> Stashed changes
        }

        // 6. Happy Path: Driver found, return all data
        return response()->json([
            'driver_info' => new DriverResource($driverInfo),
            'sightings' => SightingResource::collection($sightings),
        ]);
    }
}

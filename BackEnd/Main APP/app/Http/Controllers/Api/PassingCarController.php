<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PassingCar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use App\Services\TrafficAPIService;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;


class PassingCarController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'plate_num' => 'required|string|max:255',
            'camera_id' => 'required|string|max:255|exists:cameras,camera_id', // <-- MODIFIED
            'timestamp' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $passingCar = PassingCar::create($validator->validated());

        return response()->json($passingCar->load('camera'), 201);
    }

    public function searchByPlate(string $plate_num, TrafficAPIService $trafficService): JsonResponse
    {
        // Step 1: Get the driver's information (this remains the same)
        $driverInfo = $trafficService->getDriverInfoByPlate($plate_num);
        if (!$driverInfo) {
            return response()->json(['message' => 'Driver with this plate number was not found.'], 404);
        }

        // Step 2: Get all sightings and their camera info in one query.
        $sightings = PassingCar::with('camera')
                                ->where('plate_num', $plate_num)
                                ->latest('timestamp')
                                ->get();
        
        // Step 3: Structure the final response
        $data = [
            'driver_info' => $driverInfo,
            'sightings'   => $sightings,
        ];

        ActivityLog::create([
            'user_id'     => Auth::user()->user_id ?? null,
            'action_type' => 'بحث عن لوحة',
            'description' => "تم البحث عن معلومات السائق والمشاهدات للوحة رقم {$plate_num}",
            'model_type'  => 'PassingCar',
            'model_id'    => null, // لا يوجد ID محدد في هذه الحالة
            'ip_address'  => request()->ip(),
            'user_agent'  => request()->userAgent(),
        ]);

        return response()->json($data);
    }
}

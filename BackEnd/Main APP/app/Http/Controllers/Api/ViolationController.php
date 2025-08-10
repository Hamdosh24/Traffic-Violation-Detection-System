<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Violation;
use App\Models\ViolationType;
use App\Services\TrafficAPIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class ViolationController extends Controller
{
    /**
     * Store a newly created violation in storage.
     * This is called by the AI system.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Services\TrafficAPIService  $trafficService
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, TrafficAPIService $trafficService): JsonResponse
    {
        // 1. Validate the incoming data
        $validator = Validator::make($request->all(), [
            'violation_type_key' => 'required|string|exists:violation_types,key',
            'plate_number'       => 'required|string|max:255',
            'timestamp'          => 'required|date',
            'camera_id'          => 'required|string|exists:cameras,camera_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Fetch driver info from the external traffic API
        try {
            $driverInfo = $trafficService->getDriverInfoByPlate($request->input('plate_number'));
            if (!$driverInfo) {
                return response()->json(['message' => 'رقم اللوحة المدخل غير موجود في نظام المرور.'], 404);
            }
        } catch (\Exception $e) {
            Log::error('API Call Failed: ' . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء محاولة الاتصال بنظام المرور الخارجي.'], 503); // Service Unavailable
        }
        
        // 3. Find the corresponding violation type in the local database
        $violationType = ViolationType::where('key', $request->input('violation_type_key'))->first();

        // 4. Create the violation record in the database
        $violation = Violation::create([
            'v_type_id' => $violationType->v_type_id,
            'camera_id' => $request->input('camera_id'),
            'plate_num' => $request->input('plate_number'),
            'timestamp' => $request->input('timestamp'),
        ]);

        // 5. --- Optimization ---
        // Return only a success message and the ID of the created violation
        return response()->json([
            'message' => 'Violation recorded successfully.',
            'v_id' => $violation->v_id // Use the correct primary key 'v_id' from the model
        ], 201);
    }
}

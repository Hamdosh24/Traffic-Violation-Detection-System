<?php

namespace App\Http\Controllers\Api;

use App\Events\ViolationRecorded;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreViolationRequest;
use App\Models\Violation;
use App\Models\ViolationType;
use App\Services\TrafficAPIService;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class ViolationController extends Controller
{
    public function store(StoreViolationRequest $request, TrafficAPIService $trafficService): JsonResponse
    {
        $driverInfo = null;

        try {
            $driverInfo = $trafficService->getDriverInfoByPlate($request->plate_number);
        } catch (\Exception $e) {
            Log::error('API Call Failed: ' . $e->getMessage());
        }

        if ($driverInfo === null) {
            Log::warning("Driver info not found or API call failed for plate: {$request->plate_number}");
            $driverInfo = $this->getEmptyDriverInfo();
        }

        $violationType = ViolationType::where('key', $request->violation_type_key)->first();

        $violation = Violation::create([
            'v_type_id' => $violationType->v_type_id,
            'camera_id' => $request->camera_id,
            'plate_num' => $request->plate_number,
            'timestamp' => $request->timestamp,
        ]);
        
        $violation->load('violationType', 'camera');

        // سيتم إطلاق الحدث مع بيانات السائق الكاملة للمعالجة في الخلفية
        event(new ViolationRecorded($violation, $driverInfo));

        // التعديل هنا: تم حذف حقل driver_info من الاستجابة
        return response()->json([
            'message' => 'Violation recorded successfully.',
            'v_id'    => $violation->v_id,
        ], 201);
    }

    private function getEmptyDriverInfo(): array
    {
        return [
            'first_name' => null,
            'last_name'  => null,
            'email'      => null,
            'license_no' => null,
        ];
    }
}
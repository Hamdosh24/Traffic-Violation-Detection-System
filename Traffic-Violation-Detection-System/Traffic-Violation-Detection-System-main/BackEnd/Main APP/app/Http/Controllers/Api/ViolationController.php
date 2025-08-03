<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Violation;
use App\Models\ViolationType;
use App\Services\TrafficAPIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ViolationController extends Controller
{
    /**
     * Store a newly created violation in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Services\TrafficAPIService  $trafficService
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, TrafficAPIService $trafficService)
    {
        // 1. التحقق من صحة البيانات المدخلة
        $validator = Validator::make($request->all(), [
            'violation_type_key' => 'required|string|exists:violation_types,key',
            'plate_number'       => 'required|string|max:255',
            'timestamp'          => 'required|date',
            'camera_id'          => 'required|string|exists:cameras,camera_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. جلب بيانات السائق من الـ API الخارجي عبر الخدمة
        try {
            $driverInfo = $trafficService->getDriverInfoByPlate($request->input('plate_number'));
            if (!$driverInfo) {
                return response()->json(['message' => 'رقم اللوحة المدخل غير موجود في نظام المرور.'], 404);
            }
        } catch (\Exception $e) {
            Log::error('API Call Failed: ' . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء محاولة الاتصال بنظام المرور الخارجي.'], 503); // Service Unavailable
        }
        
        // 3. العثور على نوع المخالفة المقابل في قاعدة البيانات المحلية
        $violationType = ViolationType::where('key', $request->input('violation_type_key'))->first();

        // 4. تسجيل سجل المخالفة في قاعدة البيانات
        $violation = Violation::create([
            'v_type_id' => $violationType->v_type_id,
            'camera_id' => $request->input('camera_id'),
            'plate_num' => $request->input('plate_number'),
            'timestamp' => $request->input('timestamp'),
        ]);

        // 5. تجهيز رد JSON ناجح يحتوي على جميع البيانات المطلوبة
        // نستخدم load() لتضمين بيانات النماذج المرتبطة (نوع المخالفة والكاميرا) في الرد
        $data = [
            'message'     => 'تم تسجيل المخالفة بنجاح.',
            'violation'   => $violation->load('violationType', 'camera'),
            'driver_info' => $driverInfo,
        ];

        return response()->json($data, 201);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Violation;
use App\Models\ViolationType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\TrafficAPIService;
use App\Services\CameraAPIService;
use App\Notifications\NewViolationNotification;

class ViolationController extends Controller
{
    /**
     * Store a newly created violation in storage.
     */
    public function store(Request $request, TrafficAPIService $trafficService, CameraAPIService $cameraService)
{
    // 1. التحقق الأساسي من صحة البيانات الواردة (هذا الجزء يبقى كما هو)
    $validator = Validator::make($request->all(), [
        'violation_type_key' => 'required|string|exists:violation_types,key',
        'plate_number' => 'required|string|max:255',
        'timestamp' => 'required|date',
        'camera_id' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors(), 422);
    }

    // 2. التحقق من وجود السائق والكاميرا (هذا الجزء يبقى كما هو)
    $driverInfo = $trafficService->getDriverInfoByPlate($request->input('plate_number'));
    if (!$driverInfo) {
        return response()->json(['message' => 'رقم اللوحة المدخل غير موجود في النظام.'], 422);
    }

    $cameraInfo = $cameraService->getCameraById($request->input('camera_id'));
    if (!$cameraInfo) {
        return response()->json(['message' => 'معرّف الكاميرا المدخل غير موجود في النظام.'], 422);
    }

    // 3. إنشاء سجل المخالفة (هذا الجزء يبقى كما هو)
    $violationType = ViolationType::where('key', $request->input('violation_type_key'))->first();

    $violation = Violation::create([
        'v_type_id' => $violationType->v_type_id,
        'camera_id' => $request->input('camera_id'),
        'plate_num' => $request->input('plate_number'),
        'timestamp' => $request->input('timestamp'),
    ]);
    
 
    $userToNotify = \App\Models\User::first();
    if ($userToNotify) {
    // تأكد من أن هذا السطر يستخدم اسم الكلاس الصحيح ويمرر كل البيانات
        $userToNotify->notify(new \App\Notifications\NewViolationNotification($violation, $driverInfo, $cameraInfo));
    }
    // ===================================================================

    // 5. تجميع البيانات وإرجاع استجابة ناجحة (هذا الجزء يبقى كما هو)
    $data = [
        'violation' => $violation->load('violationType'), // استخدم load() لتضمين تفاصيل نوع المخالفة
        'driver_info' => $driverInfo,
        'camera_info' => $cameraInfo,
    ];

    return response()->json($data, 201);
}

    /**
     * Display the specified resource.
     */
    public function show(Violation $violation)
    {
        return response()->json($violation);
    }
}
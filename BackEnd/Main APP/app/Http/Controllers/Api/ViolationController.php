<?php

namespace App\Http\Controllers\Api;

use App\Events\ViolationRecorded;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreViolationRequest;
use App\Models\Violation;
use App\Models\ViolationType;
use App\Services\TrafficAPIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache; // <-- 1. استيراد واجهة الكاش
use Illuminate\Support\Facades\Log;

class ViolationController extends Controller
{
    public function store(StoreViolationRequest $request, TrafficAPIService $trafficService): JsonResponse
    {
        try {
            // <-- 2. تطبيق التخزين المؤقت (Caching)
            // أنشئ مفتاحًا فريدًا للكاش خاص برقم اللوحة هذا
            $cacheKey = "driver_info_{$request->input('plate_number')}";

            // اطلب من الكاش أن يتذكر هذه المعلومة لمدة 60 دقيقة
            $driverInfo = Cache::remember($cacheKey, now()->addMinutes(60), function () use ($trafficService, $request) {
                // هذا الكود سينفذ فقط إذا لم تكن المعلومة في الكاش
                // أو إذا انتهت مدة صلاحيتها
                Log::info("Fetching driver info from external API for plate: {$request->input('plate_number')}");
                return $trafficService->getDriverInfoByPlate($request->input('plate_number'));
            });

            if (!$driverInfo) {
                // إذا لم يتم العثور على السائق، قم بحذف أي بيانات قديمة في الكاش
                Cache::forget($cacheKey);
                return response()->json(['message' => 'رقم اللوحة المدخل غير موجود في نظام المرور.'], 404);
            }
        } catch (\Exception $e) {
            Log::error('API Call Failed: ' . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ أثناء محاولة الاتصال بنظام المرور الخارجي.'], 503);
        }

        $violationType = ViolationType::where('key', $request->input('violation_type_key'))->first();

        $violation = Violation::create([
            'v_type_id' => $violationType->v_type_id,
            'camera_id' => $request->input('camera_id'),
            'plate_num' => $request->input('plate_number'),
            'timestamp' => $request->input('timestamp'),
        ]);

        // التحميل المسبق للعلاقات لتحسين الأداء
        $violation->load('violationType', 'camera');

        // إطلاق الحدث مع تمرير كل البيانات المطلوبة
        event(new ViolationRecorded($violation, $driverInfo));

        return response()->json([
            'message' => 'Violation recorded successfully and notifications are being processed.',
            'v_id' => $violation->v_id
        ], 201);
    }
}
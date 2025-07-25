<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ViolationController;
use App\Http\Controllers\Api\PassingCarController;
use App\Http\Controllers\Api\AccidentController;
use App\Models\User;
use App\Models\Violation; // <-- السطر الأول المطلوب إضافته
use App\Models\ViolationType; // <-- السطر الثاني المطلوب إضافته

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- مسارات عامة لا تتطلب Token ---
Route::post('/login', [AuthController::class, 'login']);

// --- مسارات محمية تتطلب Token للوصول ---

    // APIs for the AI system to send data
    Route::post('/violations', [ViolationController::class, 'store']);
    Route::post('/passing-cars', [PassingCarController::class, 'store']);
    Route::post('/accidents', [AccidentController::class, 'store']);
    Route::get('/accidents/new', [AccidentController::class, 'indexNew']);
    Route::patch('/accidents/{accident}/viewed', [AccidentController::class, 'markAsViewed']);


    // API to get authenticated user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });


    Route::get('/passing-cars/search/{plate_num}', [PassingCarController::class, 'searchByPlate']);


// --- مسار لاختبار نظام الإشعارات ---
Route::get('/test-notification', function () {
    // 1. تأكد من وجود مستخدم واحد على الأقل في قاعدة البيانات
    if (User::count() === 0) {
        return "خطأ: لا يوجد مستخدمون في قاعدة البيانات. الرجاء إنشاء مستخدم أولاً.";
    }

    // 2. احصل على أي نوع مخالفة للاختبار (تأكد من وجود أنواع مخالفات)
    $violationType = ViolationType::where('key', '!=', 'traffic_accident')->first();
    if (!$violationType) {
        return "خطأ: لا يوجد أنواع مخالفات عادية. الرجاء ملء جدول violation_types أولاً.";
    }

    // 3. قم بإنشاء مخالفة جديدة (هذا سيؤدي إلى تفعيل المراقب Observer)
    Violation::create([
        'v_type_id' => $violationType->v_type_id,
        'camera_id' => 'CAM-TEST-01',
        'plate_num' => 'TEST-123',
        'timestamp' => now(),
    ]);

    return "تم إنشاء مخالفة اختبار! تم تفعيل عملية الإشعار. تحقق من بريدك الإلكتروني أو Mailtrap.";
});
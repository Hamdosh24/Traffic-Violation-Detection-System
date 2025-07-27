<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ViolationController;
use App\Http\Controllers\Api\PassingCarController;
use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Statistics\StatisticsController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\CameraController;
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
Route::middleware('auth:sanctum')->group(function () {

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

});

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

// CRUD System
Route::prefix('admin')->middleware(['auth:sanctum', 'manager'])->group(function () {
    Route::get('employees', [EmployeeController::class, 'index']);
    Route::post('employees', [EmployeeController::class, 'store']);
    Route::get('employees/{user_id}', [EmployeeController::class, 'show']);
    Route::put('employees/{user_id}', [EmployeeController::class, 'update']);
    Route::delete('employees/{user_id}', [EmployeeController::class, 'destroy']);
});

// Statistics
Route::middleware(['auth:sanctum', 'employee'])->group(function () {
    Route::post('/violations/hourly', [StatisticsController::class, 'getViolationsByHour']);
    Route::post('/violations/by-region', [StatisticsController::class, 'getViolationsByRegion']);
});

// Activity Log
Route::middleware(['auth:sanctum', 'manager'])->group(function () {
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::get('/activity-logs/search', [ActivityLogController::class, 'search']);
});

// Log out
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Cameras list
Route::middleware(['auth:sanctum', 'employee'])->group(function () {
    Route::get('/cameras', [CameraController::class, 'index']);
    Route::get('/cameras/{id}', [CameraController::class, 'show']);
});

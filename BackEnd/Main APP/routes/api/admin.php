<?php

use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- مسارات الأنظمة الخارجية (مثل كاميرات الذكاء الاصطناعي) ---
// هذه المجموعة قد تحتاج إلى middleware مصادقة مختلف (مثل API Key)
// في الوقت الحالي، سنتركها مفتوحة مع حماية من كثرة الطلبات (throttle)
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/accidents', [AccidentController::class, 'store']);
});


// --- مسار الإشعارات الفورية (SSE) للموظفين ---
// هذا المسار يستخدم middleware مخصص للتحقق من التوكن عبر الرابط
Route::get('/accidents/stream', [AccidentController::class, 'streamNewAccidents'])
    ->middleware(['query.token', 'throttle:sse']); // تطبيق middleware التوكن وتحديد المعدل


// --- مسارات الموظفين المصادق عليهم ---
// هذه المجموعة محمية بواسطة Sanctum وتتطلب صلاحيات موظف
Route::middleware(['auth:sanctum', 'token.expires', 'employee'])->group(function () {
    // مسار لمتابعة حادث معين
    Route::patch('/accidents/{accident}/acknowledge', [AccidentController::class, 'acknowledge']);

    // مسار لجلب جميع الحوادث الأخيرة مع pagination
    Route::get('/accidents/all', [AccidentController::class, 'indexAll']);

    // مسار للبحث عن سيارة عابرة
    Route::get('/passing-cars/search/{plate_num}', [PassingCarController::class, 'searchByPlate']);
});

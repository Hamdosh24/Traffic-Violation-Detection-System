<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;
use App\Http\Controllers\Api\NotificationController; // أضف هذا السطر


// Accident & Search Management (For Employees & Managers)
Route::middleware(['auth:sanctum', 'token.expires', 'employee'])->group(function () {
    Route::get('/accidents/stream', action: [AccidentController::class, 'streamNewAccidents']);
    Route::get('/accidents/all', [AccidentController::class, 'indexAll']);
    /////

    Route::get('/notifications', [NotificationController::class, 'index']);

    // 2. جلب الإشعارات غير المقروءة فقط
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);

    // 3. تعليم إشعار واحد كمقروء
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // 4. تعليم كل الإشعارات كمقروءة
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);



    Route::get('/passing-cars/search/{plate_num}', [PassingCarController::class, 'searchByPlate']); //
});



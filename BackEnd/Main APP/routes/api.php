<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Statistics\StatisticsController;
use App\Http\Controllers\Statistics\FiltersController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\CameraController;
use App\Http\Controllers\Api\CameraReceiverController;
use App\Http\Controllers\Api\AiController;


/*
|--------------------------------------------------------------------------
| Main API Routes
|--------------------------------------------------------------------------
*/

// Public route for user login
Route::post('/login', [AuthController::class, 'login'])->middleware('customThrottle:5,1');

// Protected route to get authenticated user info
Route::middleware(['auth:sanctum', 'token.expires'])->get('/user', function (Request $request) {
    return $request->user();
});

// Routes from the 'kareem' branch
Route::prefix('admin')->group(base_path('routes/api/admin.php'));
Route::prefix('system')->group(base_path('routes/api/system.php'));
//------------------------

// CRUD System
Route::prefix('admin')->middleware(['auth:sanctum', 'token.expires', 'manager'])->group(function () {
    Route::get('employees', [EmployeeController::class, 'index']);
    Route::post('employees', [EmployeeController::class, 'store']);
    Route::get('employees/{user_id}', [EmployeeController::class, 'show']);
    Route::put('employees/{user_id}', [EmployeeController::class, 'update']);
    Route::delete('employees/{user_id}', [EmployeeController::class, 'destroy']);
});

// Statistics
Route::prefix('violations')->middleware(['auth:sanctum', 'token.expires', 'employee'])->group(function () {
    Route::post('hourly', [StatisticsController::class, 'getDataByHour']);
    Route::post('by-region', [StatisticsController::class, 'getDataByRegion']);
    Route::get('filters/by-hour', [FiltersController::class, 'getDataByHour']);
    Route::get('filters/by-region', [FiltersController::class, 'getDataByRegion']);
});

// Activity Log
Route::middleware(['auth:sanctum', 'token.expires', 'manager'])->group(function () {
    Route::get('/activity-logs', [ActivityLogController::class, 'getLogs']);
    Route::post('/activity-logs', [ActivityLogController::class, 'getLogs']);
});

// Log out
Route::middleware(['auth:sanctum', 'token.expires', 'customThrottle:10,1'])->post('/logout', [AuthController::class, 'logout']);

// Cameras
Route::middleware(['auth:sanctum', 'token.expires', 'employee'])->group(function () {
    Route::get('/cameras', [CameraController::class, 'index']);
    Route::get('/camera/{id}', [CameraController::class, 'show']);
});

// استقبال بيانات الكاميرات الجديدة من النظام الخارجي
Route::post('/ex_cameras', [CameraReceiverController::class, 'receive'])->middleware('check.external.api_key');

// cameras for AI
Route::get('/AI/cameras', [AiController::class, 'index'])->middleware('check.external.api_key');

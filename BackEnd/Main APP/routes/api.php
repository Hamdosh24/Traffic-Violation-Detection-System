<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
// It seems you'll need these controllers from the 'main' branch
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\FiltersController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\CameraController;
use App\Http\Controllers\Api\CameraReceiverController;
use App\Http\Controllers\Api\AiController;


/*
|--------------------------------------------------------------------------
| Main API Routes
|--------------------------------------------------------------------------
*/

// Public route for user login
Route::post('/login', [AuthController::class, 'login']);

// Protected route to get authenticated user info
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes from the 'kareem' branch
Route::prefix('admin')->group(base_path('routes/api/admin.php'));
Route::prefix('system')->group(base_path('routes/api/system.php'));

// Routes from the 'main' branch

// Statistics
Route::prefix('violations')->middleware(['auth:sanctum', 'employee'])->group(function () {
    Route::post('hourly', [StatisticsController::class, 'getDataByHour']);
    Route::post('by-region', [StatisticsController::class, 'getDataByRegion']);
    Route::get('filters/by-hour', [FiltersController::class, 'getDataByHour']);
    Route::get('filters/by-region', [FiltersController::class, 'getDataByRegion']);
});

// Activity Log
Route::middleware(['auth:sanctum', 'manager'])->group(function () {
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::get('/activity-logs/search', [ActivityLogController::class, 'search']);
    Route::get('/activity-logs/filter', [ActivityLogController::class, 'filteredLogs']);
});

// Log out
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Cameras
Route::middleware(['auth:sanctum', 'employee'])->group(function () {
    Route::get('/cameras', [CameraController::class, 'index']);
    Route::get('/camera/{id}', [CameraController::class, 'show']);
});

// استقبال بيانات الكاميرات الجديدة من النظام الخارجي
Route::post('/ex_cameras', [CameraReceiverController::class, 'receive']);

// cameras for AI
Route::get('AI/cameras', [AiController::class, 'index']);
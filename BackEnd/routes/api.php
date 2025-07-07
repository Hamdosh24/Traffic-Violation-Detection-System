<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ViolationController;
use App\Http\Controllers\Api\PassingCarController;
use App\Http\Controllers\Api\AccidentController;

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

    // API to get authenticated user info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

});

// Test route (optional)
Route::get('/test', function () {
    return ['message' => 'API route file is working correctly!'];
});
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ViolationController;
use App\Http\Controllers\Api\PassingCarController;
use App\Http\Controllers\Api\AccidentController;

/*
|--------------------------------------------------------------------------
| System API Routes (Your Work)
|--------------------------------------------------------------------------
*/

// All routes here are protected and used by the AI System
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/violations', [ViolationController::class, 'store']);
    Route::post('/passing-cars', [PassingCarController::class, 'store']);
    Route::post('/accidents', [AccidentController::class, 'store']);
});

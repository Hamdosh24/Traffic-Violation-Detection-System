<?php

use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;
use App\Http\Controllers\Api\ViolationController;
use Illuminate\Support\Facades\Route;

// All routes here are protected and used by the AI System
Route::middleware('check.external.api_key')->group(function () {
    Route::post('/violations', [ViolationController::class, 'store']);
    Route::post('/passing-cars', [PassingCarController::class, 'store']);
    Route::post('/accidents', action: [AccidentController::class, 'store']);
});

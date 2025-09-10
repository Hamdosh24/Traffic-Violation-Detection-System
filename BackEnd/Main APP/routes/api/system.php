<?php

use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;
use App\Http\Controllers\Api\ViolationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Group of routes protected by a custom API key middleware.
// These endpoints are intended to be used by the external AI System.
Route::middleware('check.external.api_key')->group(function () {
    Route::post('/violations', [ViolationController::class, 'store']);
    Route::post('/passing-cars', [PassingCarController::class, 'store']);
    Route::post('/accidents', [AccidentController::class, 'store']);
});

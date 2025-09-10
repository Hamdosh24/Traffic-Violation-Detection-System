<?php

use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// This group is protected by a rate limiter to prevent abuse.
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/accidents', [AccidentController::class, 'store']);
});

// This route provides a persistent connection to stream real-time updates to the frontend.
Route::get('/accidents/stream', [AccidentController::class, 'streamNewAccidents'])
    ->middleware(['query.token', 'throttle:sse']);

// This group is protected by Sanctum and requires specific employee permissions.
Route::middleware(['auth:sanctum', 'token.expires', 'employee'])->group(function () {
    Route::patch('/accidents/{accident}/acknowledge', [AccidentController::class, 'acknowledge']);
    // Endpoint to fetch a list of all recent accidents.
    Route::get('/accidents/all', [AccidentController::class, 'indexAll']);
    // Endpoint to search for a passing car by its plate number.
    Route::get('/passing-cars/search/{plate_num}', [PassingCarController::class, 'searchByPlate']);
});


<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;
Route::get('/accidents/stream', action: [AccidentController::class, 'streamNewAccidents']);

// Accident & Search Management (For Employees & Managers)
Route::middleware(['auth:sanctum', 'token.expires', 'employee'])->group(function () {
    Route::get('/accidents/all', [AccidentController::class, 'indexAll']);
    Route::patch('/accidents/{accident}/viewed', [AccidentController::class, 'markAsViewed']); //
    Route::get('/passing-cars/search/{plate_num}', [PassingCarController::class, 'searchByPlate']); //
});



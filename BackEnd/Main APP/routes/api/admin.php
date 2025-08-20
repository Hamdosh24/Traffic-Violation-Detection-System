<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;
use App\Http\Controllers\Api\NotificationController; // أضف هذا السطر




// Accident & Search Management (For Employees & Managers)
Route::middleware(['auth:sanctum', 'token.expires', 'employee'])->group(function () {


    Route::get('/accidents/stream', action: [AccidentController::class, 'streamNewAccidents']);
    Route::patch('/accidents/{accident}/acknowledge', [AccidentController::class, 'acknowledge']);
    Route::get('/accidents/active', [AccidentController::class, 'getActive']);
    Route::get('/accidents/all', [AccidentController::class, 'indexAll']);
    Route::get('/passing-cars/search/{plate_num}', [PassingCarController::class, 'searchByPlate']); //
});



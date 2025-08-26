<?php

use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'token.expires', 'employee'])->group(function () {
    Route::get('/accidents/stream', action: [AccidentController::class, 'streamNewAccidents']);
    Route::patch('/accidents/{accident}/acknowledge', [AccidentController::class, 'acknowledge']);
    Route::get('/accidents/all', [AccidentController::class, 'indexAll']);
    Route::get('/passing-cars/search/{plate_num}', [PassingCarController::class, 'searchByPlate']); //
});

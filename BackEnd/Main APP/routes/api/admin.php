<?php

use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;
use Illuminate\Support\Facades\Route;


    // Route::get('/accidents/stream', action: [AccidentController::class, 'streamNewAccidents']);

    Route::get('/accidents/stream', [AccidentController::class, 'streamNewAccidents'])
     ->middleware('query.token');

Route::middleware(['auth:sanctum', 'token.expires', 'employee'])->group(function () {
    Route::patch('/accidents/{accident}/acknowledge', [AccidentController::class, 'acknowledge']);
    Route::get('/accidents/all', [AccidentController::class, 'indexAll']);
    Route::get('/passing-cars/search/{plate_num}', [PassingCarController::class, 'searchByPlate']); //
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;

/*
|--------------------------------------------------------------------------
| Admin Panel API Routes (Your Colleague's Work)
|--------------------------------------------------------------------------
*/

// Accident & Search Management (For Employees & Managers)
Route::middleware(['auth:sanctum', 'employee'])->group(function () {
    Route::get('/accidents/new', [AccidentController::class, 'indexNew']); //
    Route::patch('/accidents/{accident}/viewed', [AccidentController::class, 'markAsViewed']); //
    
    // --- START: الإضافة الجديدة هنا ---
    Route::get('/accidents/stream', [AccidentController::class, 'streamNewAccidents']);
    // --- END: الإضافة الجديدة هنا ---

    Route::get('/passing-cars/search/{plate_num}', [PassingCarController::class, 'searchByPlate']); //
});



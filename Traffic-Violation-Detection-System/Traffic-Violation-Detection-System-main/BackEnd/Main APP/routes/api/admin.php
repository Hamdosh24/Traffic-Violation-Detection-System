<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\PassingCarController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Statistics\StatisticsController;
use App\Http\Controllers\ActivityLogController;

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

// Employee & Log Management (For Managers Only)
Route::middleware(['auth:sanctum', 'manager'])->group(function () { //
    // Employee CRUD
    Route::apiResource('employees', EmployeeController::class)->parameters(['employees' => 'user_id']); //

    // Activity Logs
    Route::get('/activity-logs', [ActivityLogController::class, 'index']); //
    Route::get('/activity-logs/search', [ActivityLogController::class, 'search']); //
});

// Statistics (For Employees & Managers)
Route::middleware(['auth:sanctum', 'employee'])->group(function () { //
    Route::post('/statistics/violations/hourly', [StatisticsController::class, 'getViolationsByHour']); //
    Route::post('/statistics/violations/by-region', [StatisticsController::class, 'getViolationsByRegion']); //
});
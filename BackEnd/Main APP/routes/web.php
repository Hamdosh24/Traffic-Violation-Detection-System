<?php

use App\Http\Controllers\Api\ViolationController;
use Illuminate\Support\Facades\Route; // This line is new and important

Route::get('/', function () {
    return view('welcome');
});

// This is the new route for showing violation details
Route::get('/violations/{violation}', [ViolationController::class, 'show'])->name('violations.show');

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ViolationController; // This line is new and important


Route::get('/', function () {
    return view('welcome');
});

// This is the new route for showing violation details
Route::get('/violations/{violation}', [ViolationController::class, 'show'])->name('violations.show');
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ViolationController; // تأكد من وجود هذا
use App\Http\Controllers\Api\PassingCarController;

// Route for user login
Route::post('/login', [AuthController::class, 'login']);

// Route to receive new violations from the AI system
Route::post('/violations', [ViolationController::class, 'store']); // <-- هذا هو السطر المفقود

Route::post('/passing-cars', [PassingCarController::class, 'store']);


// Test route
Route::get('/test', function () {
    return ['message' => 'API route file is working correctly!'];
});

// Protected route to get authenticated user info
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController; // <-- أضف هذا السطر

Route::post('/login', [AuthController::class, 'login']);

Route::get('/test', function () {
    return ['message' => 'API route file is working correctly!'];
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
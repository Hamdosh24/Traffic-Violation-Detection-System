<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CameraController;
use App\Http\Controllers\StreamController;


Route::post('/camera', [CameraController::class, 'store']);

Route::GET('/stream/{id}', [StreamController::class, 'streamById']);
// Route::GET('/stream', [StreamController::class, 'streamById']);
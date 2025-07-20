<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\CameraController;


Route::get('/drivers/{plate_number}', [DriverController::class, 'show']);
Route::get('/cameras', [CameraController::class, 'index']);
Route::get('/cameras/{camera_id}', [CameraController::class, 'show']);
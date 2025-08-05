<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\CameraController;
// --- إضافة جديدة ---
use App\Http\Controllers\Api\FineUpdateController; // استدعاء الـ Controller الجديد


Route::get('/drivers/{plate_number}', [DriverController::class, 'show']);
Route::get('/cameras', [CameraController::class, 'index']);
Route::get('/cameras/{camera_id}', [CameraController::class, 'show']);
Route::post('/fines/update', [FineUpdateController::class, 'triggerUpdate']);
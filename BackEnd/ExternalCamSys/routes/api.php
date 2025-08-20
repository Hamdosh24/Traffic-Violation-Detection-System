<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CameraController;

Route::prefix('camera')->group(function () {
    Route::post('/', [CameraController::class, 'store']);
    Route::put('/{id}', [CameraController::class, 'update']);
    Route::delete('/{id}', [CameraController::class, 'destroy']);
});
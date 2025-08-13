<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\FineUpdateController; 


Route::get('/drivers/{plate_number}', [DriverController::class, 'show']);
Route::post('/fines/update', [FineUpdateController::class, 'triggerUpdate']);
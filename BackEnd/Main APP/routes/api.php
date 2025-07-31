<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Main API Routes
|--------------------------------------------------------------------------
*/

// Public route for user login
Route::post('/login', [AuthController::class, 'login']);

// Protected route to get authenticated user info
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::prefix('admin')->group(base_path('routes/api/admin.php'));
Route::prefix('system')->group(base_path('routes/api/system.php'));

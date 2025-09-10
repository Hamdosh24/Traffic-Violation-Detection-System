<?php

use App\Http\Controllers\Api\ViolationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group.
|
*/

// The default welcome route that displays the main landing page.
Route::get('/', function () {
    return view('welcome');
});

// This route is for displaying a detailed, publicly accessible view of a single violation.
// It uses Route Model Binding to automatically fetch the {violation} from the database.
// The ->name() method assigns a unique name to the route, which is useful for URL generation.
Route::get('/violations/{violation}', [ViolationController::class, 'show'])->name('violations.show');

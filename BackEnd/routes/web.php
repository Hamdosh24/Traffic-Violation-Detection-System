<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Home;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/kareem/',function($id){
    echo("Welcome");


});

;

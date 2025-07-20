<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // <-- 1. Add this line
use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    use HasFactory; // <-- 2. And this line
}
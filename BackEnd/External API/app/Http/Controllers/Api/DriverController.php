<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // <-- 1. Add this line

class DriverController extends Controller
{
    public function show(string $plate_number)
    {
        Log::info("Request received for plate number: " . $plate_number); // <-- 2. Add log

        $driver = Driver::where('plate_num', $plate_number)->first();

        if ($driver) {
            Log::info("Driver found.", $driver->toArray()); // <-- 3. Add log
            return response()->json($driver);
        }

        Log::warning("Driver NOT found for plate number: " . $plate_number); // <-- 4. Add log
        return response()->json(['message' => 'The requested plate number was not found in the database.'], 404);
    }
}
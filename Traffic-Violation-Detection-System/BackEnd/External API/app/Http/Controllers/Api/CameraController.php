<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Camera;
use Illuminate\Http\Request;

class CameraController extends Controller
{
    // Method to get all cameras
    public function index()
    {
        return response()->json(Camera::all());
    }

    // Method to get a single camera by its camera_id
    public function show(string $camera_id)
    {
        $camera = Camera::where('camera_id', $camera_id)->first();

        if ($camera) {
            return response()->json($camera);
        }

        return response()->json(['message' => 'Camera not found.'], 404);
    }
}
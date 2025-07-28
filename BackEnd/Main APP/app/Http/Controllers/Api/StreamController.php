<?php

namespace App\Http\Controllers\Api;

use App\Models\Camera;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Http;

class StreamController extends Controller
{
    public function stream($id)
    {
        try {
            $camera = Camera::findOrFail($id); 
            return response()->json(['stream_url' => $camera->key]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'الكاميرا غير متاحة: ' . $e->getMessage()], 500);
        }
    }
}
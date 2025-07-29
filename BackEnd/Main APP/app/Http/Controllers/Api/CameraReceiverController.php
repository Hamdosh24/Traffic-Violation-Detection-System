<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\camera;

class CameraReceiverController extends Controller
{
    public function receive(Request $request)
    {
        if ($request->bearerToken() !== env('CAMERA_RECEIVER_TOKEN')) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // التحقق من البيانات
        $validated = Validator::make($request->all(), [
            'region' => 'nullable|string',
            'governorate' => 'required|string',
            'street' => 'nullable|string',
            'coordinates' => 'nullable|string',
            'rtsp_url' => 'required|string',
            'hls_path' => 'required|string',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validated->errors()
            ], 422);
        }

        // تخزين البيانات في قاعدة البيانات
        Camera::create($validated->validated());
        
        return response()->json([
            'status' => 'success',
            'message' => 'تم استقبال البيانات بنجاح'
        ]);
    }
}
    
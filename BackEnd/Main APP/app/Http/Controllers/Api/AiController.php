<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Camera;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class AiController extends Controller
{
    // عرض جميع الكاميرات
    public function index(Request $request)
    {
        try {
            // جلب الأعمدة المطلوبة فقط
            $cameras = Camera::select('camera_id', 'rtsp_url', 'status')->where('status', 'active')->get();

            return response()->json($cameras, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching cameras: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving cameras.'], 500);
        }
    }
}

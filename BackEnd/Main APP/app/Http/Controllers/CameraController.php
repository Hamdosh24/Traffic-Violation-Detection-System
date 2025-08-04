<?php

namespace App\Http\Controllers;

use App\Models\Camera;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CameraController extends Controller
{
    // عرض جميع الكاميرات
    public function index(Request $request)
    {
        try {
            ActivityLog::create([
                'user_id'     => Auth::user()->user_id ?? null,
                'action_type' => 'عرض كل الكاميرات',
                'description' => 'عرض قائمة كل الكاميرات في النظام',
                'model_type'  => 'Camera',
                'model_id'    => null,
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            // جلب الأعمدة المطلوبة فقط
            $cameras = Camera::select('camera_id', 'region', 'governorate')->get();

            return response()->json($cameras, 200);
        } catch (\Exception $e) {
            Log::error('Error fetching cameras: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving cameras.'], 500);
        }
    }

    // عرض كاميرا واحدة حسب camera_id
    public function show(Request $request, $id)
    {
        try {
            $camera = Camera::find($id);

            if (!$camera) {
                return response()->json(['message' => 'Camera not found'], 404);
            }

            ActivityLog::create([
                'user_id'     => Auth::user()->user_id ?? null,
                'action_type' => 'عرض كاميرا',
                'description' => "عرض معلومات الكاميرا ذات المعرف {$id}",
                'model_type'  => 'Camera',
                'model_id'    => $camera->camera_id,
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            // إخفاء حقل rtsp_url من النتيجة
            $camera->makeHidden(['rtsp_url']);

            return response()->json($camera, 200);
        } catch (\Exception $e) {
            Log::error("Error fetching camera with ID {$id}: " . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving the camera.'], 500);
        }
    }
}

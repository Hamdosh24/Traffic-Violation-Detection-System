<?php

namespace App\Http\Controllers;

use App\Models\Camera;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;


class CameraController extends Controller
{
    // عرض جميع الكاميرات
    public function index(Request $request)
    {
        ActivityLog::create([
            'user_id'     => Auth::user()->user_id ?? null, // null لو لم يكن مستخدم مسجل
            'action_type' => 'Cameras Query',
            'description' => 'Retrieved information about all cameras.',
            'model_type'  => 'Camera',
            'model_id'    => null, // لا يرتبط بسجل محدد هنا
            'ip_address'  => $request->ip(),
            'user_agent'  => $request->userAgent(),
        ]);

        return response()->json(Camera::all(), 200);
    }

    // عرض كاميرا واحدة حسب camera_id
    public function show(Request $request,$id)
    {
        $camera = Camera::find($id);

        if (!$camera) {
            return response()->json(['message' => 'Camera not found'], 404);
        }

        ActivityLog::create([
            'user_id'     => Auth::user()->user_id ?? null, // null لو لم يكن مستخدم مسجل
            'action_type' => 'Cameras Query',
            'description' => 'Retrieved information about specific cameras.',
            'model_type'  => 'Camera',
            'model_id'    => null, // لا يرتبط بسجل محدد هنا
            'ip_address'  => $request->ip(),
            'user_agent'  => $request->userAgent(),
        ]);

        return response()->json($camera, 200);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Camera;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

class CameraController extends Controller
{
    public function store(Request $request)
    {
        try {
            // تحقق من صحة البيانات المطلوبة
            $validated = $request->validate([
                'region' => 'required|string',
                'governorate' => 'required|string',
                'street' => 'required|string',
                'coordinates' => 'nullable|string',
                'hls_path' => 'nullable|string|unique:cameras,hls_path',
                'rtsp_url' => 'required|string|unique:cameras,rtsp_url',
                'ip_address' => 'required|ip|unique:cameras,ip_address',
                'status' => 'required|in:active,inactive',
                'model' => 'required|string',
                'installation_date' => 'required|date',
                'description' => 'nullable|string',
            ]);


            // إنشاء الكاميرا
            $camera = Camera::create($validated);

            return response()->json([
                'message' => 'Camera created successfully',
                'data' => $camera
            ], 201);

        } catch (ValidationException $e) {
            // خطأ في التحقق من البيانات
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (QueryException $e) {
            // خطأ في قاعدة البيانات
            return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage(),
            ], 500);

        } catch (\Exception $e) {
            // أي خطأ آخر
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}


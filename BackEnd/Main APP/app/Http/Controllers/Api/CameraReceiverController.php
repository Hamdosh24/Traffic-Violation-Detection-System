<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Camera;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CameraReceiverController extends Controller
{
    /**
     * استقبال كاميرا جديدة أو تعديل كاميرا موجودة
     */
    public function receive(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'external_id' => 'required|integer', // لم نضع unique هنا لأنه قد يكون تعديل
            'region' => 'nullable|string',
            'governorate' => 'required|string',
            'street' => 'nullable|string',
            'coordinates' => 'nullable|string',
            'rtsp_url' => 'required|string',
            'hls_path' => 'required|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        if ($validated->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validated->errors(),
            ], 422);
        }

        // إنشاء أو تحديث الكاميرا
        Camera::updateOrCreate(
            ['external_id' => $request->external_id],
            $validated->validated()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'تم استقبال البيانات وتخزينها بنجاح',
        ]);
    }

    /**
     * حذف كاميرا بواسطة external_id
     */
    public function destroy($external_id)
    {
        $camera = Camera::where('external_id', $external_id)->first();

        if (! $camera) {
            return response()->json([
                'status' => 'error',
                'message' => 'Camera not found',
            ], 404);
        }

        $camera->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Camera deleted successfully',
        ]);
    }
}

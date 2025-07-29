<?php

// namespace App\Http\Controllers;

// use App\Models\Camera;
// use Illuminate\Support\Facades\Artisan;

// class StreamController extends Controller
// {
//     public function startById($id)
//     {
//         $camera = Camera::findOrFail($id);

//         Artisan::call('stream:hls-id', ['id' => $id]);

//         return response()->json([
//             'stream_url' => url("hls/{$id}/index.m3u8")
//         ]);
//     }
// }


namespace App\Http\Controllers;

use App\Models\Camera;
use Illuminate\Http\Request;
use Symfony\Component\Process\Process;

class StreamController extends Controller
{
    /**
     * بدء بث HLS لكاميرا معيّنة حسب الـ ID
     * 
     * @param int $id معرف الكاميرا
     * @return \Illuminate\Http\JsonResponse
     */
    public function streamById($id)
    {
        // جلب بيانات الكاميرا من قاعدة البيانات
        $camera = Camera::find($id);

        // تحقق من وجود الكاميرا
        if (!$camera) {
            return response()->json(['error' => 'Camera not found'], 404);
        }

        // مسار حفظ ملفات بث HLS داخل public/hls/{cameraId}
        $hlsPath = public_path("hls/{$camera->id}");

        // إذا مجلد البث غير موجود، أنشئه مع صلاحيات مناسبة
        if (!file_exists($hlsPath)) {
            mkdir($hlsPath, 0755, true);
        }

        // رابط البث الذي سيُعاد للواجهة الأمامية (React مثلا)
        $hlsUrl = url("hls/{$camera->id}/index.m3u8");

        // بعد التأكد من إنشاء المجلد أو بدء البث
        $camera->hls_path = $hlsUrl;
        $camera->save();

        // تحقق إذا ملف البث موجود (يعني البث شغال مسبقًا)
        if (!file_exists($hlsPath . '/index.m3u8')) {
            // إعداد أمر ffmpeg لتحويل RTSP إلى HLS
            $cmd = [
                'ffmpeg',           // برنامج ffmpeg
                '-i', $camera->rtsp_url,  // رابط البث الأصلي (RTSP)
                '-c:v', 'libx264',  // ترميز الفيديو
                '-f', 'hls',        // صيغة الإخراج: HLS
                '-hls_time', '2',   // مدة كل قطعة فيديو (ثانيتين)
                '-hls_list_size', '5', // عدد القطع في قائمة التشغيل
                '-hls_flags', 'delete_segments', // حذف القطع القديمة للحفاظ على التخزين
                "{$hlsPath}/index.m3u8"  // ملف قائمة التشغيل النهائي
            ];

            // تشغيل الأمر في الخلفية (بدون انتظار انتهاء العملية)
            $process = new Process($cmd);
            $process->start();
        }

        // إعادة رابط البث للعميل بصيغة JSON
        return response()->json([
            'camera_id' => $camera->id,
            'hls_url' => $hlsUrl
        ]);
    }
}

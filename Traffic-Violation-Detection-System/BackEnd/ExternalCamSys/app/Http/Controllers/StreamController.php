<?php

// namespace App\Http\Controllers;

// use App\Models\Camera;
// use Illuminate\Http\Request;
// use Symfony\Component\Process\Process;

// use Symfony\Component\Process\Exception\ProcessFailedException;

// class StreamController extends Controller
// {
    
//     public function streamById($id)
//     {
//         $camera = Camera::find($id);

//         if (!$camera) {
//             return response()->json(['error' => 'Camera not found'], 404);
//         }

//         $ffmpegPath = 'C:\ffmpeg\bin\ffmpeg.exe';
//         $rtspUrl  = $camera->rtsp_url;

//         if (!$rtspUrl) {
//             return response()->json(['error' => 'RTSP URL not configured'], 400);
//         }

//         $outputPath = public_path("hls/$id");

//         if (!file_exists($outputPath)) {
//             mkdir($outputPath, 0777, true);
//         }

//         $outputFile = $outputPath . DIRECTORY_SEPARATOR . 'index.m3u8';

//         // أمر تشغيل الملف مع بارامترات
//         $batFile = base_path('C:/Users/Dell/Documents/GitHub/Traffic-Violation-Detection-System/camera_stream_simulation/stream.bat');
//         $command = "start /B cmd /C \"$batFile\" \"$rtspUrl\" \"$outputPath\"";
//         // $logFile = storage_path("logs/ffmpeg_$id.log");

//         // // أمر FFmpeg بدون cmd/start
//         // $command = [
//         //     $ffmpegPath,
//         //     '-rtsp_transport', 'tcp',
//         //     '-i', $streamUrl,
//         //     '-c:v', 'libx264',
//         //     '-preset', 'veryfast',
//         //     '-f', 'hls',
//         //     '-hls_time', '2',
//         //     '-hls_list_size', '5',
//         //     '-hls_flags', 'delete_segments',
//         //     $outputFile
//         // ];

//         // $process = new Process($command);
//         // $process->setTimeout(0);

//         // // تشغيل FFmpeg بشكل غير متزامن
//         // $process->run();

//         // if (!$process->isSuccessful()) {
//         //     return response()->json([
//         //         'error' => 'فشل ffmpeg',
//         //         'command' => implode(' ', $command),
//         //         'output' => $process->getOutput(),
//         //         'errorOutput' => $process->getErrorOutput(),
//         //     ]);
//         // }


//         // // احفظ HLS URL في قاعدة البيانات مباشرة
//         // $camera->hls_path = asset("hls/$id/index.m3u8");
//         // $camera->save();

//         return response()->json([
//             'message' => 'تم بدء البث (قد يستغرق بضع ثوانٍ حتى يظهر)',
//             'hls_url' => $camera->hls_path,
//         ]);
//     }


namespace App\Http\Controllers;

use App\Models\Camera;
use Illuminate\Http\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class StreamController extends Controller
{
    public function streamById($id)
    {
        try {
            $camera = Camera::find($id);

            if (!$camera) {
                return response()->json(['error' => 'Camera not found'], 404);
            }

            $rtspUrl  = $camera->rtsp_url;
            if (!$rtspUrl) {
                return response()->json(['error' => 'RTSP URL not configured'], 400);
            }

            $outputPath = public_path("hls/$id");
            $outputPath = str_replace('/', '\\', $outputPath); // لتحويل كل / إلى \


            if (!file_exists($outputPath)) {
                mkdir($outputPath, 0777, true);
            }

            // 🧠 تأكد أن المسار لا يحتوي على شرطات مائلة معكوسة فقط
            // $batFile = base_path('camera_stream_simulation/stream.bat'); // تأكد من المسار النسبي إن أمكن
            $batFile = 'C:\\Users\\Dell\\Documents\\GitHub\\Traffic-Violation-Detection-System\\camera_stream_simulation\\stream.bat';

            if (!file_exists($batFile)) {
                return response()->json(['error' => 'Batch file not found', 'path' => $batFile], 500);
            }

            $cmdExe = 'C:\Windows\System32\cmd.exe';

            $command = [
                $cmdExe,
                '/C',
                $batFile,
                $rtspUrl,
                $outputPath
            ];

            $process = new Process($command);
            $process->run();

            if (!$process->isSuccessful()) {
                return response()->json([
                    'error' => 'فشل تنفيذ ملف الباتش',
                    'command' => implode(' ', $command),
                    'output' => $process->getOutput(),
                    'errorOutput' => $process->getErrorOutput(),
                ]);
            }
            // احفظ الرابط المؤقت (رغم أن الملف قد لا يكون جاهز بعد)
            $camera->hls_path = asset("hls/{$id}/index.m3u8");
            $camera->save();

            return response()->json([
                'message' => 'تم بدء البث (قد يستغرق بضع ثوانٍ حتى يظهر)',
                'hls_url' => $camera->hls_path,
                'command' => $command
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'استثناء غير متوقع',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}

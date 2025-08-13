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
//         try {
//             $camera = Camera::find($id);

//             if (!$camera) {
//                 return response()->json(['error' => 'Camera not found'], 404);
//             }

//             $rtspUrl  = $camera->rtsp_url;
//             if (!$rtspUrl) {
//                 return response()->json(['error' => 'RTSP URL not configured'], 400);
//             }

//             $outputPath = public_path("hls/$id");
//             $outputPath = str_replace('/', '\\', $outputPath); // لتحويل كل / إلى \


//             if (!file_exists($outputPath)) {
//                 mkdir($outputPath, 0777, true);
//             }

//             // 🧠 تأكد أن المسار لا يحتوي على شرطات مائلة معكوسة فقط
//             // $batFile = base_path('camera_stream_simulation/stream.bat');
//             $batFile = 'C:\\Users\\Dell\\Desktop\\Traffic-Violation-Detection-System\\camera_stream_simulation\\stream_to_hls.bat';

//             if (!file_exists($batFile)) {
//                 return response()->json(['error' => 'Batch file not found', 'path' => $batFile], 500);
//             }

//             $cmdExe = 'C:\Windows\System32\cmd.exe';

//             $command = [
//                 $cmdExe,
//                 '/C',
//                 $batFile,
//                 $rtspUrl,
//                 $outputPath
//             ];

//             $process = new Process($command);
//             $process->run();

//             if (!$process->isSuccessful()) {
//                 return response()->json([
//                     'error' => 'فشل تنفيذ ملف الباتش',
//                     'command' => implode(' ', $command),
//                     'output' => $process->getOutput(),
//                     'errorOutput' => $process->getErrorOutput(),
//                 ]);
//             }
//             // احفظ الرابط المؤقت (رغم أن الملف قد لا يكون جاهز بعد)
//             $camera->hls_path = asset("hls/{$id}/index.m3u8");
//             $camera->save();

//             return response()->json([
//                 'message' => 'تم بدء البث (قد يستغرق بضع ثوانٍ حتى يظهر)',
//                 'hls_url' => $camera->hls_path,
//                 'command' => $command
//             ]);
//         } catch (\Throwable $e) {
//             return response()->json([
//                 'error' => 'استثناء غير متوقع',
//                 'message' => $e->getMessage(),
//                 'file' => $e->getFile(),
//                 'line' => $e->getLine(),
//                 'trace' => $e->getTraceAsString()
//             ], 500);
//         }
//     }
// }

namespace App\Http\Controllers;

use App\Models\Camera;
use Illuminate\Http\Request;
use Symfony\Component\Process\Process;

class StreamController extends Controller
{
    public function streamById($id)
    {
        try {
            // جلب الكاميرا من قاعدة البيانات
            $camera = Camera::find($id);

            if (!$camera) {
                return response()->json(['error' => 'Camera not found'], 404);
            }

            $rtspUrl = $camera->rtsp_url;
            if (!$rtspUrl) {
                return response()->json(['error' => 'RTSP URL not configured'], 400);
            }

            // مسار الإخراج HLS
            $outputPath = public_path("hls/$id");
            if (!file_exists($outputPath)) {
                mkdir($outputPath, 0777, true);
            }

            // مسار ffmpeg
            $ffmpegPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe';

            // ملف اللوج
            $logFile = $outputPath . DIRECTORY_SEPARATOR . 'ffmpeg_output.log';

            // الأمر لتشغيل ffmpeg
            $command = [
                $ffmpegPath,
                '-rtsp_transport', 'udp',
                '-i', $rtspUrl,
                '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23',
                '-f', 'hls', '-hls_time', '2', '-hls_list_size', '6', '-hls_flags', 'delete_segments',
                $outputPath . DIRECTORY_SEPARATOR . 'index.m3u8'
            ];

            // تشغيل العملية في الخلفية
            // تشغيل ffmpeg في الخلفية وتوجيه المخرجات إلى ملف اللوج
            $process = new Process($command);
            $process->setTimeout(null);
            $process->start(function ($type, $buffer) use ($logFile) {
                file_put_contents($logFile, $buffer, FILE_APPEND);
            });

            // نكتب اللوج بشكل منفصل عبر ffmpeg نفسه (append to log file)
            file_put_contents($logFile, "Starting FFmpeg...\n", FILE_APPEND);

            // // الانتظار بضع ثواني حتى يتولد index.m3u8
            // $maxWait = 30; // ثواني
            // $elapsed = 0;
            // while ($elapsed < $maxWait) {
            //     if (file_exists($outputPath . DIRECTORY_SEPARATOR . 'index.m3u8')) {
            //         break;
            //     }
            //     sleep(1);
            //     $elapsed++;
            // }

            // if (!file_exists($outputPath . DIRECTORY_SEPARATOR . 'index.m3u8')) {
            //     return response()->json([
            //         'error' => 'HLS index file was not created in time',
            //         'log' => $logFile
            //     ], 500);
            // }

            // حفظ رابط HLS في قاعدة البيانات
            $camera->hls_path = asset("hls/{$id}/index.m3u8");
            $camera->save();

            return response()->json([
                'message' => 'تم بدء البث (قد يستغرق بضع ثوانٍ حتى يظهر)',
                'hls_url' => $camera->hls_path,
                'command' => implode(' ', $command),
                'log_file' => $logFile
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

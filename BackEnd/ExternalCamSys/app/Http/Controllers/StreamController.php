<?php

namespace App\Http\Controllers;

use App\Models\Camera;
use Illuminate\Http\Request;
use Symfony\Component\Process\Process;

use Symfony\Component\Process\Exception\ProcessFailedException;

class StreamController extends Controller
{
//     public function streamById($id)
//     {
//         // جلب بيانات الكاميرا من قاعدة البيانات
//         $camera = Camera::find($id);

//         if (!$camera) {
//             return response()->json(['error' => 'Camera not found'], 404);
//         }

//         $ffmpegPath = 'C:\ffmpeg\bin\ffmpeg.exe';
//         $streamUrl = $camera->rtsp_url;
//         if (!$streamUrl) {
//             return response()->json(['error' => 'RTSP URL not configured'], 400);
//         }

//         $outputDir = public_path("hls/{$camera->camera_id}");
//         $outputFile = $outputDir . DIRECTORY_SEPARATOR . 'index.m3u8';

//         // تأكد من وجود المجلد
//         if (!file_exists($outputDir)) {
//             mkdir($outputDir, 0777, true);
//         }

//         // $command = "\"$ffmpegPath\" -rtsp_transport tcp -i \"$streamUrl\" -c:v libx264 -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments \"$outputFile\"";

//         $command = [
//             $ffmpegPath,
//             '-rtsp_transport', 'udp',
//             '-i', $streamUrl,
//             '-c:v', 'libx264',
//             '-f', 'hls',
//             '-hls_time', '2',
//             '-hls_list_size', '5',
//             '-hls_flags', 'delete_segments',
//             $outputFile,
//         ];

//         // تشغيل عبر cmd.exe لتفادي مشاكل Winsock على ويندوز
//         // $process = new Process(['cmd', '/C', $command]);
//         $process = new Process($command);
//         $process->setTimeout(null); // بدون وقت انتهاء
//         try {
//             $process->run();

//             if (!$process->isSuccessful()) {
//                 return response()->json([
//                     'error' => 'فشل تشغيل FFmpeg',
//                     'output' => $process->getErrorOutput(),
//                 ], 500);
//             }

//             return response()->json(['message' => 'تم بدء البث بنجاح']);

//         } catch (ProcessFailedException $e) {
//             return response()->json([
//                 'error' => 'حدث استثناء أثناء تشغيل FFmpeg',
//                 'details' => $e->getMessage(),
//             ], 500);
//         }

//     }
// }

    //     $ffmpegCommand = 'C:/ffmpeg/bin/ffmpeg.exe -rtsp_transport tcp -i rtsp://127.0.0.1:8554/mystream -c:v libx264 -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments "C:\Users\Dell\Documents\GitHub\Traffic-Violation-Detection-System\BackEnd\ExternalCamSys\public\hls\1\index.m3u8"';


    //     // حفظ رابط HLS في قاعدة البيانات إن رغبت
    //     $camera->hls_path = asset("hls/{$camera->camera_id}/index.m3u8");
    //     $camera->save();

    //     return response()->json([
    //         'camera_id' => $camera->camera_id,
    //         'hls_url' => $camera->hls_path
    //     ]);
    // }

    public function streamById($id)
    {
        $camera = Camera::find($id);

        if (!$camera) {
            return response()->json(['error' => 'Camera not found'], 404);
        }

        $ffmpegPath = 'C:\ffmpeg\bin\ffmpeg.exe';
        $streamUrl = $camera->rtsp_url;

        if (!$streamUrl) {
            return response()->json(['error' => 'RTSP URL not configured'], 400);
        }

        $outputDir = public_path("hls/{$camera->camera_id}");
        $outputFile = $outputDir . DIRECTORY_SEPARATOR . 'index.m3u8';

        if (!file_exists($outputDir)) {
            mkdir($outputDir, 0777, true);
        }

        $logFile = storage_path("logs/ffmpeg_{$camera->camera_id}.log");

        $command = "start /B \"ffmpeg_stream\" \"$ffmpegPath\" -rtsp_transport tcp -i \"$streamUrl\" -c:v libx264 -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments \"$outputFile\" > \"$logFile\" 2>&1";

        $process = Process::fromShellCommandline($command);
        $process->disableOutput();

        try {
            $process->run();

            // حفظ رابط HLS في قاعدة البيانات
            $camera->hls_path = asset("hls/{$camera->camera_id}/index.m3u8");
            $camera->save();

            return response()->json([
                'message' => 'تم بدء البث بنجاح',
                'hls_url' => $camera->hls_path
            ]);

        } catch (ProcessFailedException $e) {
            return response()->json([
                'error' => 'حدث استثناء أثناء تشغيل FFmpeg',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
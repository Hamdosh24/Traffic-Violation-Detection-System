<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Camera;
use Symfony\Component\Process\Process;

class StreamHlsById extends Command
{
    protected $signature = 'stream:hls-id {id}';
    protected $description = 'Start HLS stream for a camera by ID';

    public function handle()
    {
        $id = $this->argument('id');

        // جلب بيانات الكاميرا من قاعدة البيانات
        $camera = Camera::find($id);

        if (!$camera) {
            $this->error("Camera with ID $id not found.");
            return 1;
        }

        $rtspUrl = $camera->rtsp_url;

        $hlsPath = public_path("hls/{$id}");

        // تأكد من وجود مجلد البث  
        if (!file_exists($hlsPath)) {
            mkdir($hlsPath, 0755, true);
        }


        // أمر ffmpeg لتحويل RTSP إلى HLS
        $cmd = [
            'ffmpeg',
            '-i', $camera->rtsp_url,
            '-c:v', 'libx264',
            '-f', 'hls',
            '-hls_time', '2',
            '-hls_list_size', '5',
            '-hls_flags', 'delete_segments',
            "$hlsPath/index.m3u8"
        ];

        // تشغيل العملية بالخلفية بدون انتظار الانتهاء
        $process = new Process($cmd);
        $process->start();

        $this->info("Started HLS stream for camera ID: {$id}");

        return 0;
    }
}

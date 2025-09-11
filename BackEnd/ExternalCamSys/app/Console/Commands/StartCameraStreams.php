<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class StartCameraStreams extends Command
{
    protected $signature = 'streams:start';
    protected $description = 'تشغيل ملفات الباتش للبث المباشر';

    public function handle()
    {
        $batFile = base_path('storage/camera_stream_simulation/1-Stream_RTSP.bat');

        if (!file_exists($batFile)) {
            $this->error("الملف غير موجود: $batFile");
            return;
        }

        // تشغيل الباتش كبروسس مستقل
        pclose(popen('start "" "' . $batFile . '"', 'r'));

        $this->info("تم تشغيل ملف الباتش كبروسس مستقل.");
    }

}

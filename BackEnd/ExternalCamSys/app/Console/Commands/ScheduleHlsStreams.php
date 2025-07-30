<?php

// namespace App\Console\Commands;

// use Illuminate\Console\Command;
// use Illuminate\Console\Scheduling\Schedule;
// use App\Models\Camera;

// class ScheduleHlsStreams extends Command
// {
//     protected $signature = 'schedule:hls-streams';
//     protected $description = 'جدولة بث HLS لجميع الكاميرات المفعّلة';

//     public function handle()
//     {
//         $this->info('جدولة عمليات البث...');


//         Camera::where('ai_enabled', true)->each(function ($camera) {
//             // جدولة لكل كاميرا مفعّلة
//             app(Schedule::class)->command("stream:hls-id {$camera->id}")
//                 ->everyMinute()
//                 ->withoutOverlapping();
//         });
//     }
// }

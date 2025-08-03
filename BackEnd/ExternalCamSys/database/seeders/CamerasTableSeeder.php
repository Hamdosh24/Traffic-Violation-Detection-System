<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Camera;

class CamerasTableSeeder extends Seeder
{
    public function run()
    {
        $streets = [
            'شارع خالد بن الوليد',
            'شارع بغداد',
            'شارع الثورة',
            'شارع الحجاز',
            'شارع فلسطين',
            'شارع النصر',
            'شارع الزاهرة',
            'شارع 29 أيار',
            'شارع القوتلي',
            'شارع القصر',
            'شارع الشيخ سعد',
            'شارع ناظم باشا',
            'شارع أبو رمانة',
            'شارع كورنيش الميدان',
            'شارع برنية',
        ];

        $counter = 1;

        // 3 كاميرات - اتستراد المزة
        for ($i = 0; $i < 3; $i++, $counter++) {
            Camera::create([
                'region' => 'دمشق',
                'governorate' => 'دمشق',
                'street' => 'اتستراد المزة',
                'coordinates' => '33.5138,36.2765',
                'ip_address' => '192.168.100.' . $counter,
                'status' => 'active',
                'rtsp_url' => 'rtsp://192.168.100.' . $counter . '/stream',
                'hls_path' => '/hls/stream' . $counter . '.m3u8',
                'ai_enabled' => rand(0, 1),
                'model' => 'Model-' . chr(64 + ($counter % 26)),
                'installation_date' => now()->subDays($counter * 5)->toDateString(),
                'description' => 'كاميرا رقم ' . $counter . ' في اتستراد المزة',
            ]);
        }

        // 6 كاميرات - المتحلق الجنوبي
        for ($i = 0; $i < 6; $i++, $counter++) {
            Camera::create([
                'region' => 'دمشق',
                'governorate' => 'دمشق',
                'street' => 'المتحلق الجنوبي',
                'coordinates' => '33.5138,36.2765',
                'ip_address' => '192.168.100.' . $counter,
                'status' => 'inactive',
                'rtsp_url' => 'rtsp://192.168.100.' . $counter . '/stream',
                'hls_path' => '/hls/stream' . $counter . '.m3u8',
                'ai_enabled' => rand(0, 1),
                'model' => 'Model-' . chr(64 + ($counter % 26)),
                'installation_date' => now()->subDays($counter * 3)->toDateString(),
                'description' => 'كاميرا رقم ' . $counter . ' في المتحلق الجنوبي',
            ]);
        }

        // باقي الكاميرات - شوارع عشوائية
        for (; $counter <= 20; $counter++) {
            Camera::create([
                'region' => 'دمشق',
                'governorate' => 'دمشق',
                'street' => $streets[array_rand($streets)],
                'coordinates' => '33.5138,36.2765',
                'ip_address' => '192.168.100.' . $counter,
                'status' => rand(0, 1) ? 'active' : 'inactive',
                'rtsp_url' => 'rtsp://192.168.100.' . $counter . '/stream',
                'hls_path' => '/hls/stream' . $counter . '.m3u8',
                'ai_enabled' => rand(0, 1),
                'model' => 'Model-' . chr(64 + ($counter % 26)),
                'installation_date' => now()->subDays($counter * 2)->toDateString(),
                'description' => 'كاميرا رقم ' . $counter . ' في دمشق',
            ]);
        }
    }
}

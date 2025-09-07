<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Camera;

class CamerasTableSeeder extends Seeder
{
    public function run()
    {
        $streets = [
            ['street' => 'شارع خالد بن الوليد', 'region' => 'المجتهد', 'governorate' => 'دمشق'],
            ['street' => 'شارع بغداد', 'region' => 'شارع بغداد', 'governorate' => 'دمشق'],
            ['street' => 'شارع الثورة', 'region' => 'المرجة', 'governorate' => 'دمشق'],
            ['street' => 'شارع فلسطين', 'region' => 'العباسيين', 'governorate' => 'دمشق'],
            ['street' => 'شارع النصر', 'region' => 'الحجاز', 'governorate' => 'دمشق'],
            ['street' => 'شارع الزاهرة', 'region' => 'الزاهرة', 'governorate' => 'دمشق'],
            ['street' => 'شارع 29 أيار', 'region' => 'السبع بحرات', 'governorate' => 'دمشق'],
            ['street' => 'شارع أسد الدين', 'region' => 'ركن الدين', 'governorate' => 'دمشق'],
            ['street' => 'شارع الشيخ سعد', 'region' => 'المزة', 'governorate' => 'دمشق'],
            ['street' => 'شارع ناظم باشا', 'region' => 'المهاجرين', 'governorate' => 'دمشق'],
            ['street' => 'شارع أبو رمانة', 'region' => 'أبو رمانة', 'governorate' => 'دمشق'],
            ['street' => 'شارع كورنيش الميدان', 'region' => 'الميدان', 'governorate' => 'دمشق'],
            ['street' => 'شارع برنية', 'region' => 'ساحة الميسات', 'governorate' => 'دمشق'],
            ['street' => 'شارع الحضارة', 'region' => 'حي الكرملة', 'governorate' => 'حمص'],
            ['street' => 'اوتوستراد المزة', 'region' => 'المزة', 'governorate' => 'دمشق'],
            ['street' => 'شارع الجمارك', 'region' => 'كفرسوسة', 'governorate' => 'دمشق'],
        ];

        foreach ($streets as $index => $selected) {
            Camera::create([
                'street' => $selected['street'],
                'region' => $selected['region'],
                'governorate' => $selected['governorate'],
                'coordinates' => '33.5138,36.2765',
                'ip_address' => '192.168.100.' . ($index + 1),
                'status' => 'inactive',
                'rtsp_url' => 'rtsp://127.0.0.1:8554/cam' . ($index + 1),
                'hls_path' => 'http://127.0.0.1:8888/cam' . ($index + 1) . '/index.m3u8',
                'ai_enabled' => rand(0, 1),
                'model' => 'Model-' . chr(65 + ($index % 26)),
                'installation_date' => now()->subDays(($index + 1) * 2)->toDateString(),
                'description' => 'كاميرا في ' . $selected['street'],
            ]);
        }

    }
}

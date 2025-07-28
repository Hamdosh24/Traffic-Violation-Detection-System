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
            'شار ناظم باشا',
            'شارا أبو رمانة',
            'شارع كورنيش الميدان',
            'شارع برنية',
        ];

        // عداد للكاميرات
        $counter = 1;

        // إضافة 3 كاميرات لـ "اتستراد المزة"
        for ($i = 0; $i < 3; $i++, $counter++) {
            Camera::create([
                'region' => 'دمشق',
                'governorate' => 'دمشق',
                'street' => 'اتستراد المزة',
                'coordinates' => '33.5138,36.2765',
                'key' => 'key' . str_pad($counter, 4, '0', STR_PAD_LEFT),
                'ip_address' => '192.168.100.' . $counter,
                'status' => 'active',
                'model' => 'Model-' . chr(64 + ($counter % 26)),
                'installation_date' => now()->subDays($counter * 5)->toDateString(),
                'description' => 'كاميرا رقم ' . $counter . ' في اتستراد المزة',
            ]);
        }

        // إضافة 6 كاميرات لـ "المتحلق الجنوبي"
        for ($i = 0; $i < 6; $i++, $counter++) {
            Camera::create([
                'region' => 'دمشق',
                'governorate' => 'دمشق',
                'street' => 'المتحلق الجنوبي',
                'coordinates' => '33.5138,36.2765',
                'key' => 'key' . str_pad($counter, 4, '0', STR_PAD_LEFT),
                'ip_address' => '192.168.100.' . $counter,
                'status' => 'active',
                'model' => 'Model-' . chr(64 + ($counter % 26)),
                'installation_date' => now()->subDays($counter * 5)->toDateString(),
                'description' => 'كاميرا رقم ' . $counter . ' في المتحلق الجنوبي',
            ]);
        }

        // إضافة بقية الكاميرات (20 - 3 - 6 = 11 كاميرا) في الشوارع العشوائية
        for (; $counter <= 20; $counter++) {
            Camera::create([
                'region' => 'دمشق',
                'governorate' => 'دمشق',
                'street' => $streets[array_rand($streets)],
                'coordinates' => '33.5138,36.2765',
                'key' => 'key' . str_pad($counter, 4, '0', STR_PAD_LEFT),
                'ip_address' => '192.168.100.' . $counter,
                'status' => 'active',
                'model' => 'Model-' . chr(64 + ($counter % 26)),
                'installation_date' => now()->subDays($counter * 5)->toDateString(),
                'description' => 'كاميرا رقم ' . $counter . ' في دمشق',
            ]);
        }
    }
}

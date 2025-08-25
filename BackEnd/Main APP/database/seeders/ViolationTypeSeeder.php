<?php

namespace Database\Seeders;

use App\Models\ViolationType;
use Illuminate\Database\Seeder; // لا تنس استدعاء الـ Model

class ViolationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $violations = [
            [
                'key' => 'no_seatbelt',
                'type_name' => 'اكتشاف عدم وضع حزام الأمان',
                'fine_amount' => 150
            ],
            [
                'key' => 'phone_usage',
                'type_name' => 'اكتشاف استعمال الهاتف أثناء القيادة',
                'fine_amount' => 200
            ],
            [
                'key' => 'red_light',
                'type_name' => 'اكتشاف تجاوز الإشارة الحمراء',
                'fine_amount' => 500
            ],
            [
                'key' => 'wrong_way',
                'type_name' => 'اكتشاف القيادة عكس السير',
                'fine_amount' => 500
            ],
            [
                'key' => 'no_plate',
                'type_name' => 'اكتشاف غياب لوحة المركبة',
                'fine_amount' => 1000
            ]
        ];

        foreach ($violations as $violation) {
            ViolationType::updateOrCreate(
                ['key' => $violation['key']],
                $violation
            );
        }
    }
}

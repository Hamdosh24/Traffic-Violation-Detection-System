<?php

namespace Database\Factories;

use App\Models\ViolationType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ViolationTypeFactory extends Factory
{
    protected $model = ViolationType::class;

    public function definition()
    {
        // مصفوفة أنواع المخالفات مع المفاتيح الفريدة
        $types = [
            ['type_name' => 'اكتشاف عدم وضع حزام الأمان', 'key' => 'no_seatbelt', 'fine_amount' => 200],
            ['type_name' => 'اكتشاف استعمال الهاتف أثناء القيادة', 'key' => 'phone_usage', 'fine_amount' => 300],
            ['type_name' => 'اكتشاف تجاوز الإشارة الحمراء', 'key' => 'red_light', 'fine_amount' => 400],
            ['type_name' => 'اكتشاف القيادة عكس السير', 'key' => 'wrong_way', 'fine_amount' => 500],
            ['type_name' => 'اكتشاف غياب لوحة المركبة', 'key' => 'no_plate', 'fine_amount' => 150],
        ];

        // اختيار عنصر عشوائي من المصفوفة بدون تكرار المفتاح في قاعدة البيانات
        $type = $this->faker->unique()->randomElement($types);

        return [
            'v_type_id' => (string) Str::uuid(),
            'type_name' => $type['type_name'],
            'key' => $type['key'],
            'fine_amount' => $type['fine_amount'],
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Models\ViolationType; // استدعاء المودل الخاص بجدول أنواع المخالفات
use Illuminate\Database\Seeder;

/**
 * يقوم هذا الـ Seeder بملء جدول `violation_types` بالبيانات الأساسية.
 * الـ Seeders مفيدة لضمان وجود بيانات أولية في قاعدة البيانات عند إعداد التطبيق.
 */
class ViolationTypeSeeder extends Seeder
{
    /**
     * تشغيل عملية ملء قاعدة البيانات بالبيانات الأولية.
     *
     * @return void
     */
    public function run(): void
    {
        // مصفوفة تحتوي على جميع أنواع المخالفات التي يجب أن تكون موجودة في النظام.
        $violations = [
            [
                'key'         => 'no_seatbelt',
                'type_name'   => 'اكتشاف عدم وضع حزام الأمان',
                'fine_amount' => 150,
            ],
            [
                'key'         => 'phone_usage',
                'type_name'   => 'اكتشاف استعمال الهاتف أثناء القيادة',
                'fine_amount' => 200,
            ],
            [
                'key'         => 'red_light',
                'type_name'   => 'اكتشاف تجاوز الإشارة الحمراء',
                'fine_amount' => 500,
            ],
            [
                'key'         => 'wrong_way',
                'type_name'   => 'اكتشاف القيادة عكس السير',
                'fine_amount' => 500,
            ],
            [
                'key'         => 'no_plate',
                'type_name'   => 'اكتشاف غياب لوحة المركبة',
                'fine_amount' => 1000,
            ],
            // --- ✅ المخالفة الجديدة التي تمت إضافتها ---
            [
                'key'         => 'speeding',
                'type_name'   => 'اكتشاف تجاوز السرعة المحددة',
                'fine_amount' => 300,
            ],
        ];

        // المرور على كل مخالفة في المصفوفة وإضافتها إلى قاعدة البيانات.
        foreach ($violations as $violation) {
            // استخدام دالة updateOrCreate الذكية.
            ViolationType::updateOrCreate(
                // الشرط: ابحث عن سجل يطابق هذا الـ 'key'.
                ['key' => $violation['key']],
                // البيانات: إذا وجدته، قم بتحديثه بهذه البيانات. إذا لم تجده، قم بإنشاء سجل جديد بها.
                $violation
            );
        }
    }
}

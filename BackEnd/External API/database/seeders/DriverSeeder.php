<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Driver;

class DriverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- ✨ بداية الإضافة الجديدة: إنشاء سائق ثابت للـتجربة ✨ ---
        
        Driver::firstOrCreate(
            // الشرط: ابحث عن سائق بهذا الرقم لمنع تكراره
            ['phone_num' => '+963933359912'],
            
            // البيانات: إذا لم تجده، قم بإنشائه بهذه البيانات
            [
                'first_name' => 'كريم',
                'last_name'  => 'قلاش',
                'email'      => 'kareem.kallash@test.com', // بريد إلكتروني فريد للتجربة
                'plate_num'  => '9999999' // رقم لوحة فريد للتجربة
            ]
        );

        // --- 🔚 نهاية الإضافة الجديدة 🔚 ---


        // هذا السطر الأصلي يبقى كما هو لإنشاء باقي السائقين العشوائيين
        Driver::factory()->count(20)->create();
    }
}
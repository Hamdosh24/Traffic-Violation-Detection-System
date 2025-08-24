<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * هذه الدالة هي التي يتم تنفيذها عندما نبني الجدول
     */
    public function up(): void
    {
        // هنا نطلب من لارافيل إنشاء جدول جديد اسمه 'passing_cars'
        Schema::create('passing_cars', function (Blueprint $table) {
            // العمود الأول: المفتاح الأساسي للجدول، من نوع UUID ليكون فريدًا جدًا
            $table->uuid('p_car_id')->primary();

            // العمود الثاني: لتخزين معرّف الكاميرا التي رصدت السيارة
            $table->string('camera_id');

            // العمود الثالث: لتخزين رقم لوحة السيارة المرصودة
            $table->string('plate_num');

            // العمود الرابع: لتخزين وقت وتاريخ الرصد بدقة
            $table->timestamp('timestamp');

            // هذان العمودان تضيفهما لارافيل تلقائيًا: created_at و updated_at
            // لتسجيل وقت إنشاء السجل ووقت آخر تعديل عليه
            $table->index('plate_num');
            $table->index('timestamp');
        });
    }

    /**
     * Reverse the migrations.
     * هذه الدالة يتم تنفيذها عندما نريد حذف الجدول (للتراجع عن التغيير)
     */
    public function down(): void
    {
        Schema::dropIfExists('passing_cars');
    }
};

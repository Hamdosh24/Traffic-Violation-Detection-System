<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * هذه الدالة تضيف الفهارس للجدول الموجود
     */
    public function up(): void
    {
        // نستخدم Schema::table لتعديل جدول موجود
        Schema::table('passing_cars', function (Blueprint $table) {
            // نضيف الفهارس للأعمدة المطلوبة
            $table->index('plate_num');
            $table->index('timestamp');
        });
    }

    /**
     * Reverse the migrations.
     * هذه الدالة تحذف الفهارس في حال التراجع عن الـ migration
     */
    public function down(): void
    {
        Schema::table('passing_cars', function (Blueprint $table) {
            // نحذف الفهارس باستخدام اسمها الافتراضي
            $table->dropIndex('passing_cars_plate_num_index');
            $table->dropIndex('passing_cars_timestamp_index');
        });
    }
};

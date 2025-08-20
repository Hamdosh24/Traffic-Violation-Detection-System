<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('accidents', function (Blueprint $table) {
            // عمود لتخزين ID الموظف الذي تبنى الحادث
            $table->uuid('claimed_by')->nullable()->after('status');
            
            // عمود لتخزين وقت تبني الحادث
            $table->timestamp('claimed_at')->nullable()->after('claimed_by');

            // إنشاء علاقة المفتاح الخارجي مع جدول المستخدمين
            // nullOnDelete يعني أنه إذا تم حذف مستخدم، ستبقى قيمة claimed_by فارغة ولن يتم حذف الحادث
            $table->foreign('claimed_by')
                  ->references('user_id')
                  ->on('users')
                  ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('accidents', function (Blueprint $table) {
            // حذف العلاقة والأعمدة عند التراجع
            $table->dropForeign(['claimed_by']);
            $table->dropColumn(['claimed_by', 'claimed_at']);
        });
    }
};
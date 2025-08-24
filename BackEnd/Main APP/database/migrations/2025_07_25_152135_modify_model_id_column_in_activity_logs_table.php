<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            // حذف العمود
            $table->dropColumn('model_id');
        });

        Schema::table('activity_logs', function (Blueprint $table) {
            $table->uuid('model_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            // حذف العمود المُعاد إنشاؤه في حالة rollback
            $table->dropColumn('model_id');
        });
    }
};

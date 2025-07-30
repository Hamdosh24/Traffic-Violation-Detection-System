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
        Schema::table('cameras', function (Blueprint $table) {
            $table->boolean('hls_enabled')->default(true); // لتشغيل البث عند الطلب
            $table->boolean('ai_enabled')->default(false); // لتفعيل البث للذكاء الاصطناعي 

            $table->dropColumn('key'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cameras', function (Blueprint $table) {
            $table->dropColumn('rtsp_url');
            $table->dropColumn('hls_path');

            $table->string('key')->after('location');
        });
    }
};

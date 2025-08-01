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
            $table->string('rtsp_url')->nullable()->after('key');  // إضافة عمود rtsp_url
            $table->string('hls_path')->nullable()->after('rtsp_url');  // إضافة عمود hls_path

            $table->dropColumn('key');  // حذف عمود key
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

<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('cameras', function (Blueprint $table) {
            $table->string('hls_path')->nullable();
            $table->string('rtsp_url')->nullable(); 

            $table->dropColumn('hls_enabled'); 
        });
    }

    public function down(): void
    {
        Schema::table('cameras', function (Blueprint $table) {
            $table->dropColumn('hls_path');
            $table->string('hls_enabled');
        });
    }
};

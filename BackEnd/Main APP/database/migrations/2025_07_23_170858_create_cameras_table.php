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
        Schema::create('cameras', function (Blueprint $table) {
            $table->id('camera_id');
            $table->unsignedBigInteger('external_id')->nullable();
            $table->string('rtsp_url')->nullable();
            $table->string('hls_path')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('region');
            $table->string('governorate');
            $table->string('street')->nullable();
            $table->string('coordinates')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cameras');
    }
};

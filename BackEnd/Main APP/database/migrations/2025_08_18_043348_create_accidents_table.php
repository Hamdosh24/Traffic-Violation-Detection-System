<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accidents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('camera_id');

            $table->timestamp('timestamp');
            $table->string('status')->default('new');
            $table->timestamps();

            $table->foreign('camera_id')->references('camera_id')->on('cameras')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accidents');
    }
};

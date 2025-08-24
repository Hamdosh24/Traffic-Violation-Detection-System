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
        Schema::create('violations', function (Blueprint $table) {
            $table->uuid('v_id')->primary();
            $table->uuid('v_type_id');
            $table->string('camera_id');
            $table->string('plate_num');
            $table->timestamp('timestamp');
            $table->timestamps();

            // تعريف المفتاح الأجنبي لربط المخالفة بنوعها
            $table->foreign('v_type_id')->references('v_type_id')->on('violation_types')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violations');
    }
};

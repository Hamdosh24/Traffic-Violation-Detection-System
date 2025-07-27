<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('cameras', function (Blueprint $table) {
            $table->bigIncrements('camera_id');
            $table->string('region');
            $table->string('governorate');
            $table->string('street')->nullable();
            $table->string('coordinates')->nullable();
            $table->string('key');
            $table->string('ip_address')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('model')->nullable();
            $table->date('installation_date')->nullable();
            $table->text('description')->nullable();
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

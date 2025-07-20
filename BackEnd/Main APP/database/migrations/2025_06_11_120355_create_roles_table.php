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
        Schema::create('roles', function (Blueprint $table) {
            $table->id('role_id'); // ERD specifies role_id as INT PK
            $table->string('role_name')->unique();
            $table->string('guard_name');
            $table->string('description')->nullable();
            $table->timestamps(); // 'created at' and 'updated at' in ERD
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};

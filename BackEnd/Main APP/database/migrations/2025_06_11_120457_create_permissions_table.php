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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id('permission_id'); // ERD specifies permission_id as INT PK
            $table->string('permission_name')->unique();
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
        Schema::dropIfExists('permissions');
    }
};

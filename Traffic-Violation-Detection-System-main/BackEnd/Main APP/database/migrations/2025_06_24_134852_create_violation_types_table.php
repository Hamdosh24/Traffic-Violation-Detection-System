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
        Schema::create('violation_types', function (Blueprint $table) {
            $table->uuid('v_type_id')->primary(); // مخطط ERD يحدد PK v_type_id كـ VARCHAR 
            $table->string('type_name');          // 
            $table->string('key')->unique();      // 
            $table->bigInteger('fine_amount');    // مخطط ERD يحدد fine_amount كـ BIGINT 
            $table->timestamps();                 // لإنشاء created_at و updated_at 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violation_types');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            
            // ✅ التعديل: استخدام uuidMorphs بدلاً من morphs
            // هذا السطر يُنشئ عمود notifiable_id من نوع UUID
            // وعمود notifiable_type من نوع string
            $table->uuidMorphs('notifiable'); 

            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
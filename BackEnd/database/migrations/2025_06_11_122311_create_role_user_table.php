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
        Schema::create('role_user', function (Blueprint $table) {
            // Foreign key for the roles table
            // يجب أن يكون نوع البيانات مطابقاً لعمود role_id في جدول roles
            $table->unsignedBigInteger('role_id');
            $table->foreign('role_id')->references('role_id')->on('roles')->onDelete('cascade');

            // Foreign key for the users table
            // يجب أن يكون نوع البيانات مطابقاً لعمود user_id في جدول users
            $table->uuid('user_id');
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');

            // Setting the primary key
            // هذا يضمن عدم إمكانية إسناد نفس الدور لنفس المستخدم أكثر من مرة
            $table->primary(['role_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_user');
    }
};

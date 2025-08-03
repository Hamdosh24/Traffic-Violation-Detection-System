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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->string('user_name')->unique();
            $table->string('national_num')->unique();
            $table->string('password');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone_num')->unique();
            $table->string('email')->unique(); // ERD uses 'e-mail', though 'email' is more common.
            $table->integer('age');
            $table->enum('gender', ['male', 'female']); // تأكد من أن هذه هي القيم التي تريدها

            // لا داعي لإضافة rememberToken إلا إذا كنت ستستخدم ميزة "تذكرني" في تسجيل الدخول
            // $table->rememberToken();

            $table->timestamps(); // هذا ينشئ عمودي created_at و updated_at كما هو مطلوب
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};

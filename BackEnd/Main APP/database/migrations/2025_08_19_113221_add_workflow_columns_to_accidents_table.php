<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * This migration adds 'claimed_by' and 'claimed_at' columns to the 'accidents' table.
 * It uses Schema::table() to modify an existing table.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        // Use Schema::table() to modify the existing 'accidents' table.
        Schema::table('accidents', function (Blueprint $table) {
            // Add a column to store the UUID of the employee who claimed the accident.
            // It's nullable because new accidents are unclaimed.
            // 'after('status')' places this column after the 'status' column for better organization.
            $table->uuid('claimed_by')->nullable()->after('status');

            // Add a column to store the timestamp of when the accident was claimed.
            $table->timestamp('claimed_at')->nullable()->after('claimed_by');

            // Create a foreign key relationship to the 'users' table.
            $table->foreign('claimed_by')
                  ->references('user_id') // Assumes the primary key on 'users' is 'user_id'.
                  ->on('users')
                  ->nullOnDelete(); // IMPORTANT: If the user is deleted, this field becomes NULL, but the accident record is preserved.
        });
    }

    /**
     * Reverse the migrations.
     *
     * This method undoes the changes made in the 'up' method.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('accidents', function (Blueprint $table) {
            // To remove columns with foreign keys, you must drop the foreign key constraint first.
            $table->dropForeign(['claimed_by']);

            // Then, drop the columns themselves.
            $table->dropColumn(['claimed_by', 'claimed_at']);
        });
    }
};
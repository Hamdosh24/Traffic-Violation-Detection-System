<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * This migration adds database indexes to the 'passing_cars' table.
 * Indexes are crucial for improving the performance of read queries.
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
        // Use Schema::table() to modify the existing 'passing_cars' table.
        Schema::table('passing_cars', function (Blueprint $table) {
            // Add an index to the 'plate_num' column.
            // This will make searching for cars by plate number much faster.
            $table->index('plate_num');

            // Add an index to the 'timestamp' column.
            // This will speed up queries that filter or sort by date and time.
            $table->index('timestamp');
        });
    }

    /**
     * Reverse the migrations.
     *
     * This method removes the indexes that were added in the 'up' method.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('passing_cars', function (Blueprint $table) {
            // Indexes are dropped by their conventional name, which Laravel generates automatically.
            // The format is: table_name_column_name_index
            $table->dropIndex('passing_cars_plate_num_index');
            $table->dropIndex('passing_cars_timestamp_index');
        });
    }
};
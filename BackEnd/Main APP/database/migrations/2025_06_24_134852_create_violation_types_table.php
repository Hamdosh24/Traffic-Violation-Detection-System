<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates the 'violation_types' table which will store the definitions
     * for different types of violations (e.g., speeding, illegal parking).
     */
    public function up(): void
    {
        Schema::create('violation_types', function (Blueprint $table) {
            // Primary key using a Universally Unique Identifier (UUID).
            $table->uuid('v_type_id')->primary();

            // The human-readable name of the violation, e.g., "Speeding Ticket".
            $table->string('type_name');

            // A unique programmatic key for easy lookups, e.g., "speeding_violation".
            // This key should not be changed once set.
            $table->string('key')->unique();

            // The fine amount. It's a good practice to store money in the smallest
            // currency unit (e.g., cents, halalas) as an integer to avoid float inaccuracies.
            $table->bigInteger('fine_amount');

            // Laravel's standard created_at and updated_at timestamp columns.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * This will drop the 'violation_types' table, completely removing it
     * and all its data from the database.
     */
    public function down(): void
    {
        Schema::dropIfExists('violation_types');
    }
};

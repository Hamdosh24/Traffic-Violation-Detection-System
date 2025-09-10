<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates the 'violations' table with necessary columns and foreign keys.
     */
    public function up(): void
    {
        Schema::create('violations', function (Blueprint $table) {
            // Primary key using a Universally Unique Identifier (UUID).
            $table->uuid('v_id')->primary();

            // Foreign key for the violation type (references violation_types table).
            $table->uuid('v_type_id');

            // Foreign key for the camera (references cameras table).
            // Note: If the cameras table also uses UUIDs, it's better to use `$table->uuid('camera_id')`.
            $table->string('camera_id');

            // The license plate number of the vehicle involved.
            $table->string('plate_num');

            // The exact timestamp when the violation occurred.
            $table->timestamp('timestamp');

            // Laravel's standard created_at and updated_at timestamp columns.
            $table->timestamps();

            // Define the foreign key constraint.
            // This ensures data integrity by linking to the violation_types table.
            $table->foreign('v_type_id')
                ->references('v_type_id')
                ->on('violation_types')
                ->onDelete('cascade'); // If a violation type is deleted, all related violations are also deleted.
        });
    }

    /**
     * Reverse the migrations.
     *
     * Drops the 'violations' table if it exists.
     */
    public function down(): void
    {
        Schema::dropIfExists('violations');
    }
};

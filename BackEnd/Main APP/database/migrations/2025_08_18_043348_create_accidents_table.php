<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This method creates the 'accidents' table in the database.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('accidents', function (Blueprint $table) {
            // Use UUID for a globally unique, non-sequential primary key.
            $table->uuid('id')->primary();

            // Foreign key for the camera that recorded the accident.
            // Assumes the 'cameras' table also uses 'camera_id' as its primary key.
            $table->unsignedBigInteger('camera_id');

            // The actual timestamp of when the accident occurred.
            $table->timestamp('timestamp');

            // The status of the accident, e.g., new, acknowledged. Defaults to 'new'.
            $table->string('status')->default('new');

            // Columns for tracking which user claimed the accident and when. Nullable by default.
            $table->unsignedBigInteger('claimed_by')->nullable();
            $table->timestamp('claimed_at')->nullable();

            // Standard Laravel timestamps for record creation and updates (created_at, updated_at).
            $table->timestamps();

            // --- Foreign Key Constraints for Data Integrity ---

            // Link the 'camera_id' to the 'cameras' table.
            $table->foreign('camera_id')
                  ->references('camera_id')
                  ->on('cameras')
                  ->cascadeOnDelete(); // IMPORTANT: If a camera is deleted, all its accidents are also deleted.

            // Link the 'claimed_by' user to the 'users' table.
            $table->foreign('claimed_by')
                  ->references('user_id')
                  ->on('users')
                  ->nullOnDelete(); // IMPORTANT: If a user is deleted, their claim is set to null, but the accident record remains.
        });
    }

    /**
     * Reverse the migrations.
     *
     * This method drops the 'accidents' table if it exists.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('accidents');
    }
};

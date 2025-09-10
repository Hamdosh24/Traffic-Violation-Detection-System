<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This method creates the 'passing_cars' table.
     *
     * @return void
     */
    public function up(): void
    {
        // Creates a new table named 'passing_cars' in the database.
        Schema::create('passing_cars', function (Blueprint $table) {
            // Column 1: The primary key, using a UUID for global uniqueness.
            $table->uuid('p_car_id')->primary();

            // Column 2: Stores the identifier of the camera that captured the car.
            $table->string('camera_id');

            // Column 3: Stores the plate number of the passing car.
            $table->string('plate_num');

            // Column 4: Stores the precise date and time of the sighting.
            $table->timestamp('timestamp');
        });
    }

    /**
     * Reverse the migrations.
     *
     * This method drops the 'passing_cars' table if it exists.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('passing_cars');
    }
};

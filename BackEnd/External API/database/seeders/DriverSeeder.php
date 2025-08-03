<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Driver;
// You no longer need to import Faker here

class DriverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // This single line uses the factory to create 10 drivers.
        Driver::factory()->count(20)->create();
    }
}
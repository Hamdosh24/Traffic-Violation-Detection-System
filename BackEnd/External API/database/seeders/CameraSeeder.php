<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Camera;

class CameraSeeder extends Seeder
{
    public function run(): void
    {
        Camera::factory()->count(20)->create();
    }
}
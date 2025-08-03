<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CameraFactory extends Factory
{
    public function definition(): array
{
    return [
        'camera_id' => 'CAM-' . str_pad($this->faker->unique()->numberBetween(1, 100), 3, '0', STR_PAD_LEFT),
        'location' => $this->faker->streetAddress,
        'status' => $this->faker->randomElement(['online', 'offline', 'maintenance']),
    ];
}
}
<?php

namespace Database\Factories;

use App\Models\Camera;
use Illuminate\Database\Eloquent\Factories\Factory;

class CameraFactory extends Factory
{
    protected $model = Camera::class;

    public function definition()
    {
        return [
            'region' => $this->faker->city(),
            'governorate' => $this->faker->state(),
            'street' => $this->faker->streetName(),
            'coordinates' => $this->faker->latitude().','.$this->faker->longitude(),
            'rtsp_url' => $this->faker->url(),
            'hls_path' => $this->faker->url(),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'external_id' => $this->faker->randomNumber(),
        ];
    }
}

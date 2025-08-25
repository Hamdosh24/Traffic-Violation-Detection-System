<?php

namespace Database\Factories;

use App\Models\Violation;
use App\Models\ViolationType;
use App\Models\Camera;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ViolationFactory extends Factory
{
    protected $model = Violation::class;

    public function definition()
    {
        $violationType = ViolationType::factory()->create();
        $camera = Camera::factory()->create();

        return [
            'v_id' => (string) Str::uuid(),
            'v_type_id' => $violationType->v_type_id,
            'camera_id' => $camera->camera_id,
            'plate_num' => strtoupper($this->faker->bothify('???-####')),
            'timestamp' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }
}

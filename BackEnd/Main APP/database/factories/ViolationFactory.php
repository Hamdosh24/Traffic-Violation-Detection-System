<?php

namespace Database\Factories;

use App\Models\Camera;
use App\Models\Violation;
use App\Models\ViolationType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ViolationFactory extends Factory
{
    protected $model = Violation::class;

    public function definition()
    {
        $violationType = ViolationType::inRandomOrder()->first();
        $camera = Camera::factory()->create();

        return [
            'v_id' => (string) Str::uuid(),
            'v_type_id' => $violationType->v_type_id,
            'camera_id' => $camera->camera_id,
            'plate_num' => strtoupper($this->faker->bothify('???-####')),
            'timestamp' => $this->faker->dateTimeBetween('-30 days', 'now'),
        ];
    }

    public function forCamera($camera)
    {
        return $this->for($camera, 'camera');
    }

    public function forType($type)
    {
        return $this->for($type, 'violationType'); // اسم العلاقة كما في المودل
    }
}

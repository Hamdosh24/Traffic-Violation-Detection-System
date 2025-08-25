<?php

namespace Database\Factories;

use App\Models\Accident;
use App\Models\Camera;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AccidentFactory extends Factory
{
    protected $model = Accident::class;

    public function definition()
    {
        $camera = Camera::factory()->create();

        return [
            'id' => (string) Str::uuid(),
            'camera_id' => $camera->camera_id,
            'timestamp' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'status' => 'new',
        ];
    }

    public function forCamera($camera)
    {
        return $this->for($camera, 'camera'); // تأكد أن العلاقة camera() موجودة في موديل Accident
    }

}

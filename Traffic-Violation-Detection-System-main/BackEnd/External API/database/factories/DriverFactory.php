<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DriverFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'phone_num' => $this->faker->unique()->phoneNumber,
            'email' => $this->faker->unique()->safeEmail,
            'plate_num' => $this->faker->numerify('#######'),
        ];
    }
}
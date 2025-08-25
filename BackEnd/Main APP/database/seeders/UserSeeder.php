<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // --- 1. Get the Manager Role ---
        $managerRole = Role::where('role_name', 'Manager')->first();

        // --- 2. Create the Manager User ---
        $managerUser = User::updateOrCreate(
            ['email' => 'manager@app.com'],
            [
                'user_name' => 'Beshr',
                'first_name' => 'بشر',
                'last_name' => 'القده',
                'national_num' => '1234567890',
                'phone_num' => '0987654321',
                'age' => 23,
                'gender' => 'male',
                // For better security, get password from .env file
                'password' => env('DEFAULT_MANAGER_PASSWORD', 'password123'),
            ]
        );

        // --- 3. Attach the Manager role to the new user ---
        if ($managerUser && $managerRole) {
            $managerUser->roles()->sync($managerRole->id);
        }
    }
}

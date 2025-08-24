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
                'user_name' => 'manager',
                'first_name' => 'System',
                'last_name' => 'Manager',
                'national_num' => '00000000000',
                'phone_num' => '0900000000',
                'age' => 30,
                'gender' => 'male',
                // For better security, get password from .env file
                'password' => env('DEFAULT_MANAGER_PASSWORD', 'password'),
            ]
        );

        // --- 3. Attach the Manager role to the new user ---
        if ($managerUser && $managerRole) {
            $managerUser->roles()->sync($managerRole->id);
        }
    }
}

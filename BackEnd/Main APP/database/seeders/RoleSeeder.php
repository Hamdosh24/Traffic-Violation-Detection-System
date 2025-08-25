<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder; // لا تنس استدعاء الـ Model

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::updateOrCreate(
            ['role_name' => 'Manager'],
            [
                'role_id' => 1,
                'guard_name' => 'web',
                'description' => 'System Administrator with full permissions',
            ]
        );

        Role::updateOrCreate(
            ['role_name' => 'Employee'],
            [
                'role_id' => 2,
                'guard_name' => 'web',
                'description' => 'System user with limited permissions',
            ]
        );
    }
}

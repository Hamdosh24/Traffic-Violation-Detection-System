<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role; // لا تنس استدعاء الـ Model

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
                'guard_name' => 'web',
                'description' => 'System Administrator with full permissions'
            ]
        );

        Role::updateOrCreate(
            ['role_name' => 'Employee'],
            [
                'guard_name' => 'web',
                'description' => 'System user with limited permissions'
            ]
        );
    }
}
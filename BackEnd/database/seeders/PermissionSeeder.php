<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission; // لا تنس استدعاء الـ Model

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Manager Permissions
            'manage_users',

            // Employee Permissions
            'view_violations',

        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['permission_name' => $permission],
                ['guard_name' => 'web']
            );
        }
    }
}
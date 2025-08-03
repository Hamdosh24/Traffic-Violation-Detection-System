<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // --- 1. Get Roles and Permissions ---
        $managerRole = Role::where('role_name', 'Manager')->first();
        $employeeRole = Role::where('role_name', 'Employee')->first();
        $allPermissions = Permission::all();
        $employeePermissions = Permission::where('permission_name', 'view_violations')->get();

        // --- 2. Attach Permissions to Roles ---
        // The Manager gets all permissions
        if ($managerRole) {
            $managerRole->permissions()->sync($allPermissions->pluck('id'));
        }

        // The Employee gets only specific permissions
        if ($employeeRole) {
            $employeeRole->permissions()->sync($employeePermissions->pluck('id'));
        }
    }
}
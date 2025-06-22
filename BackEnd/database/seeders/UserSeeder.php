<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- 1. Attach Permissions to Roles ---

        // Get all permissions
        $allPermissions = Permission::all();

        // Get the Manager role
        $managerRole = Role::where('role_name', 'Manager')->first();

        // Attach all permissions to the Manager role
        if ($managerRole) {
            $managerRole->permissions()->sync($allPermissions->pluck('permission_id'));
        }

        // Get the Employee role
        $employeeRole = Role::where('role_name', 'Employee')->first();

        // Get specific permissions for the Employee
        $employeePermissions = Permission::whereIn('permission_name', [
            'view_violations',

        ])->get();

        // Attach employee permissions to the Employee role
        if ($employeeRole) {
            $employeeRole->permissions()->sync($employeePermissions->pluck('permission_id'));
        }


        // --- 2. Create the Manager User ---

        $managerUser = User::updateOrCreate(
            ['email' => 'manager@app.com'], // Find user by email
            [
                'user_name' => 'manager',
                'first_name' => 'System',
                'last_name' => 'Manager',
                'national_num' => '00000000000',
                'phone_num' => '0900000000',
                'age' => 30,
                'gender' => 'male',
                'password' => 'password', // Laravel will hash this automatically
            ]
        );


        // --- 3. Attach the Manager role to the new user ---
        if ($managerUser && $managerRole) {
            $managerUser->roles()->sync([$managerRole->role_id]);
        }
    }

}

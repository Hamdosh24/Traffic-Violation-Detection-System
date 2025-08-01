<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // --- 1. SETUP & CLEANUP ---
        $this->command->info('Starting database seeding process...');
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        Role::truncate();
        Permission::truncate();
        DB::table('role_user')->truncate();
        DB::table('role_permission')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->command->info('All relevant tables have been cleared.');

        // --- 2. CREATE ROLES ---
        $adminRole = Role::create(['name' => 'admin', 'display_name' => 'Administrator']);
        $managerRole = Role::create(['name' => 'manager', 'display_name' => 'Manager']);
        $this->command->info('Roles (admin, manager) created successfully.');

        // --- 3. CREATE PERMISSIONS ---
        $permissions = [
            ['name' => 'view_dashboard', 'display_name' => 'View Dashboard'],
            ['name' => 'manage_employees', 'display_name' => 'Manage Employees'],
            ['name' => 'view_reports', 'display_name' => 'View Reports'],
            ['name' => 'manage_violations', 'display_name' => 'Manage Violations'],
            ['name' => 'view_activity_logs', 'display_name' => 'View Activity Logs'],
        ];
        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
        $this->command->info('Permissions created successfully.');

        // --- 4. ATTACH PERMISSIONS TO ROLES ---
        $all_permissions = Permission::all();
        if ($adminRole) {
            $adminRole->permissions()->attach($all_permissions->pluck('permission_id'));
            $this->command->info('All permissions have been attached to the Admin role.');
        }

        $manager_permissions = Permission::whereIn('name', ['view_dashboard', 'manage_violations'])->get();
        if ($managerRole) {
            $managerRole->permissions()->attach($manager_permissions->pluck('permission_id'));
            $this->command->info('Specific permissions have been attached to the Manager role.');
        }

        // --- 5. CREATE MANAGER USER AND ATTACH ROLE ---
        if ($managerRole) {
            $managerUser = User::create([
                'user_name' => 'manager',
                'national_num' => '0000000000',
                'password' => Hash::make('password'),
                'first_name' => 'System',
                'last_name' => 'Manager',
                'phone_num' => '0900000000',
                'email' => 'manager@app.com',
                'age' => 30,
                'gender' => 'male',
            ]);
            $managerUser->roles()->attach($managerRole->role_id);
            $this->command->info('Manager user created and role has been attached.');
        }
        
        // --- 6. SEED OTHER APPLICATION DATA ---
        $this->call([
            ViolationTypeSeeder::class,
            // You can add CameraSeeder::class here in the future if needed
        ]);

        $this->command->getOutput()->success('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    }
}

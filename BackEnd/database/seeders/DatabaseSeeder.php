<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ViolationTypeSeeder::class,
            RoleSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class, // الـ Seeder الجديد الذي يربط بينهما
            UserSeeder::class,           // الـ Seeder المبسّط الخاص بالمستخدمين
        ]);
    }
}
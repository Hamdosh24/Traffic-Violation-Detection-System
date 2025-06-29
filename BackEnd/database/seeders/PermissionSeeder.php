<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // قائمة شاملة بالصلاحيات بناءً على وثيقة SRS
        $permissions = [
            // User Management Permissions
            'manage_users',       // إدارة المستخدمين (إضافة، تعديل، حذف)

            // Violation Permissions
            'view_violations',    // عرض المخالفات

            // Dashboard & Statistics Permissions
            'view_dashboard',     // عرض لوحة التحكم الرئيسية
            'view_statistics',    // عرض الإحصائيات
            'export_reports',     // تصدير التقارير كـ PDF/Excel

            // Vehicle Tracking Permissions
            'track_vehicle',      // تتبع مركبة معينة

            // System & Roles Permissions
            'manage_roles',       // إدارة الأدوار والصلاحيات
        ];

        // نستخدم نفس الطريقة الاحترافية لإضافة الصلاحيات
        foreach ($permissions as $permissionName) {
            Permission::updateOrCreate(
                ['permission_name' => $permissionName],
                ['guard_name' => 'web'] // 'web' هو الـ guard الافتراضي في لارافيل
            );
        }
    }
}
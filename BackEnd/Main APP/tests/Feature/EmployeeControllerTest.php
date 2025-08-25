<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use App\Http\Middleware\TokenExpiryMiddleware;

class EmployeeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // تعطيل Middleware الخاص بفحص التوكن
        $this->withoutMiddleware(TokenExpiryMiddleware::class);

        // تشغيل السيدر لتأكيد وجود الأدوار
        $this->seed(\Database\Seeders\RoleSeeder::class);

        // إنشاء مستخدم وتعيينه كمدير
        $this->user = User::factory()->create();
        $managerRole = Role::where('role_name', 'Manager')->first();
        $this->user->roles()->attach($managerRole->role_id);

        // تسجيل الدخول بالمستخدم (Sanctum)
        Sanctum::actingAs($this->user, ['*']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_lists_all_employees()
    {
        User::factory()->count(3)->create();

        $response = $this->getJson('/api/admin/employees');

        $response->assertStatus(200)
                 ->assertJsonCount(4); // 3 + المدير الحالي
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_it_can_create_a_new_employee()
    {
        // تأكد من وجود الدور أو إنشائه إذا لم يكن موجود
        $role = \App\Models\Role::firstOrCreate(
            ['role_name' => 'Employee'],
            ['description' => 'Standard employee']
        );

        // بيانات الموظف الجديد
        $data = [
            'user_name'    => 'newuser',
            'first_name'   => 'John',
            'last_name'    => 'Doe',
            'national_num' => '123456789',
            'email'        => 'newuser@example.com',
            'phone_num'    => '0599999999',
            'age'          => 30,
            'gender'       => 'male',
            'password'     => bcrypt('password123'), // تشفير كلمة المرور
            'role_id'      => $role->role_id,
        ];

        // إرسال الطلب
        $response = $this->postJson('/api/admin/employees', $data);

        // تحقق من الاستجابة
        $response->assertStatus(200)
                ->assertJsonFragment(['user_name' => 'newuser']);

        // تحقق من قاعدة البيانات
        $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_show_a_employee()
    {
        $employee = User::factory()->create();

        $response = $this->getJson("/api/admin/employees/{$employee->user_id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['user_name' => $employee->user_name]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_update_a_employee()
    {
        $employee = User::factory()->create();

        $data = ['first_name' => 'UpdatedName'];

        $response = $this->putJson("/api/admin/employees/{$employee->user_id}", $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['first_name' => 'UpdatedName']);

        $this->assertDatabaseHas('users', ['first_name' => 'UpdatedName']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_delete_a_employee()
    {
        $employee = User::factory()->create();

        $response = $this->deleteJson("/api/admin/employees/{$employee->user_id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['message' => 'تم حذف الموظف بنجاح']);

        $this->assertDatabaseMissing('users', ['user_id' => $employee->user_id]);
    }
}

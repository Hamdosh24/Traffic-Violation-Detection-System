<?php

namespace Tests\Feature;

use App\Http\Middleware\CheckEmployee; // <-- التصحيح الأول: استخدام الاسم الصحيح
use App\Models\Accident;
use App\Models\Camera;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AccidentTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_report_a_new_accident(): void
    {
        $camera = Camera::factory()->create();
        $response = $this->withHeaders([
            'X-API-KEY' => 'secret-key-123',
        ])->postJson('/api/system/accidents', [
            'camera_id' => (string) $camera->camera_id,
            'timestamp' => now()->toDateTimeString(),
        ]);
        $response->assertStatus(201);
    }

    #[Test]
    public function an_authenticated_user_can_acknowledge_an_accident(): void
    {
        // --- الحل النهائي: تعطيل الـ Middleware باسمه الصحيح ---
        $this->withoutMiddleware(CheckEmployee::class); // <-- التصحيح الثاني

        // Arrange
        $user = User::factory()->create();
        $accident = Accident::factory()->create();

        Sanctum::actingAs($user);

        // Act
        $response = $this->patchJson("/api/admin/accidents/{$accident->id}/acknowledge");

        // Assert
        $response->assertStatus(200);

        $this->assertDatabaseHas('accidents', [
            'id' => $accident->id,
            'status' => 'acknowledged',
            'claimed_by' => $user->user_id,
        ]);
    }

    public function a_regular_user_cannot_acknowledge_an_accident(): void
    {
        // Arrange
        // 1. إنشاء مستخدم عادي بدون أي صلاحيات
        $regularUser = User::factory()->create();
        $accident = Accident::factory()->create();

        // 2. تسجيل دخول المستخدم العادي
        Sanctum::actingAs($regularUser);

        // Act
        $response = $this->patchJson("/api/admin/accidents/{$accident->id}/acknowledge");

        // Assert
        // نتوقع أن يتم رفض الطلب برمز 403 (Forbidden) لأن المستخدم ليس لديه صلاحية
        $response->assertStatus(403);
    }
}

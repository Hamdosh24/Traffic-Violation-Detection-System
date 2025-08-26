<?php

namespace Tests\Feature;

use App\Models\Camera;
use App\Models\ViolationType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ViolationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * اختبار إمكانية إنشاء مخالفة جديدة.
     */
    #[Test]
    public function it_can_create_a_violation(): void
    {
        // Arrange
        $camera = Camera::factory()->create();
        $violationType = ViolationType::factory()->create(['key' => 'speeding']); // استخدام key معروف

        $violationData = [
'camera_id' => (string) $camera->camera_id,
            'violation_type_key' => 'speeding', // إرسال الـ key كما يتوقع الـ Controller
            'plate_number' => '123-ABC',
            'timestamp' => now()->toDateTimeString(),
        ];

        // Act
        // تم إضافة الهيدر الخاص بالـ API Key وتصحيح المسار
        $response = $this->withHeaders([
            'X-API-KEY' => 'secret-key-123',
        ])->postJson('/api/system/violations', $violationData);

        // Assert
        $response->assertStatus(201);
        $this->assertDatabaseHas('violations', [
            'plate_num' => '123-ABC',
        ]);
    }
     #[Test]
    public function it_fails_to_create_a_violation_with_an_invalid_type_key(): void
    {
        // Arrange
        $camera = Camera::factory()->create();

        $invalidViolationData = [
            'camera_id' => (string) $camera->camera_id,
            'violation_type_key' => 'non_existent_key', // <-- نوع مخالفة غير موجود
            'plate_number' => '123-ABC',
            'timestamp' => now()->toDateTimeString(),
        ];

        // Act
        $response = $this->withHeaders([
            'X-API-KEY' => 'secret-key-123',
        ])->postJson('/api/system/violations', $invalidViolationData);

        // Assert
        // 1. نتوقع أن يكون رمز الحالة 422 (خطأ في البيانات المرسلة)
        $response->assertStatus(422);

        // 2. نتوقع أن تحتوي رسالة الخطأ على خطأ خاص بحقل "violation_type_key"
        $response->assertJsonValidationErrors('violation_type_key');
    }
}

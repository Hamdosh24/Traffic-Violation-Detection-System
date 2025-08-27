<?php

namespace Tests\Feature;

use App\Models\Camera;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PassingCarTest extends TestCase
{
    use RefreshDatabase;

    /**
     * اختبار إمكانية تسجيل سيارة مارة.
     */
    #[Test]
    public function it_can_log_a_passing_car(): void
    {
        // Arrange
        $camera = Camera::factory()->create();
        $passingCarData = [
'camera_id' => (string) $camera->camera_id,
            'plate_num' => 'XYZ-987',
            'timestamp' => now()->toDateTimeString(),
        ];

        // Act
        // تم إضافة الهيدر الخاص بالـ API Key وتصحيح المسار
        $response = $this->withHeaders([
            'X-API-KEY' => 'secret-key-123',
        ])->postJson('/api/system/passing-cars', $passingCarData);

        // Assert
        $response->assertStatus(201);
        $this->assertDatabaseHas('passing_cars', [
            'plate_num' => 'XYZ-987',
        ]);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Accident;
use App\Models\Violation;
use App\Models\ViolationType;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChartsControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // تعطيل كل الـ middleware
        $this->withoutMiddleware();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_violations_donut_chart()
    {
        // Arrange
        $type = ViolationType::factory()->create(['type_name' => 'تجاوز إشارة']);

        Violation::factory()->count(3)->create([
            'v_type_id' => $type->v_type_id, // ✅ لاحظ هنا
            'timestamp' => Carbon::now()->subDays(5),
        ]);

        // Act
        $response = $this->getJson('/api/dashboard/donut_chart');

        // Assert
        $response->assertStatus(200)
                ->assertJsonFragment([
                    'type' => 'تجاوز إشارة',
                ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_violations_trend_line()
    {
        // Arrange
        $type = ViolationType::factory()->create(); // ✅ أنشئ نوع مخالفة أولاً

        Violation::factory()->create([
            'v_type_id' => $type->v_type_id, // ✅ مرره يدوياً
            'timestamp' => Carbon::now()->subDays(2),
        ]);

        // Act
        $response = $this->getJson('/api/dashboard/line_chart');

        // Assert
        $response->assertStatus(200)
                ->assertJsonStructure([
                    ['date', 'total']
                ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_accidents_trend_line()
    {
        // Arrange
        Accident::factory()->create([
            'timestamp' => Carbon::now()->subDays(1),
        ]);

        // Act
        $response = $this->getJson('/api/dashboard/line_chart2');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     ['date', 'total']
                 ]);
    }
}

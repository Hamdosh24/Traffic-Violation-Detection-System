<?php

namespace Tests\Feature;

use App\Models\Accident;
use App\Models\Camera;
use App\Models\Violation;
use App\Models\ViolationType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BasicInfosControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_dashboard_info_successfully()
    {
        // Arrange
        $camera = Camera::factory()->create();

        $violationType = ViolationType::factory()->create();
        Violation::factory()->create([
            'camera_id' => $camera->camera_id,
            'v_type_id' => $violationType->v_type_id,
            'timestamp' => now()->subDays(5),
        ]);

        Accident::factory()->create([
            'camera_id' => $camera->camera_id,
            'timestamp' => now()->subDays(5),
        ]);

        // Act
        $response = $this->getJson('/api/dashboard/infos');

        // Assert
        $response->assertStatus(200)
            ->assertJsonStructure([
                'violations_this_month',
                'accidents_this_month',
                'most_common_violation',
                'total_cameras',
            ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_top_accident_streets()
    {
        // Arrange
        $camera = Camera::factory()->create([
            'street' => 'شارع كورنيش الميدان',
            'region' => 'الميدان',
            'governorate' => 'دمشق',
        ]);

        Accident::factory()->count(3)->create([
            'camera_id' => $camera->camera_id,
            'timestamp' => now()->subDays(10),
        ]);

        // Act
        $response = $this->getJson('/api/dashboard/acc-streets');

        // Assert
        $response->assertStatus(200)
            ->assertJsonFragment([
                'street_name' => 'شارع كورنيش الميدان',
                'region_governorate' => 'الميدان, دمشق',
                'accident_count' => 3,
            ]);
    }
}

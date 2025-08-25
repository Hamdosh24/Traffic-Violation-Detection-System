<?php

namespace Tests\Feature\Statistics;

use Tests\TestCase;
use App\Models\User;
use App\Models\Violation;
use App\Models\ViolationType;
use App\Models\Accident;
use App\Models\Camera;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StatisticsControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;


    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user, ['*']);
        $this->withoutMiddleware();

        $this->seed(\Database\Seeders\ViolationTypeSeeder::class);

        // تفعيل عرض الأخطاء الحقيقية بدل 500 generic
        $this->withoutExceptionHandling();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_data_by_hour_for_violations()
    {
        $camera = Camera::factory()->create([
            'region' => 'Region1',
            'governorate' => 'Gov1',
        ]);
        $violationType = ViolationType::first();

        Violation::factory()->count(4)
            ->forCamera($camera)
            ->forType($violationType)
            ->create(['timestamp' => now()]);

        $response = $this->postJson('/api/violations/hourly', [
            'type_name' => $violationType->type_name,
            'governorate' => 'Gov1',
            'region' => 'Region1',
            'from_date' => now()->subDay()->toDateString(),
            'to_date' => now()->toDateString(),
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['status', 'data']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_data_by_hour_for_accidents()
    {
        $camera = Camera::factory()->create(['region' => 'Region1', 'governorate' => 'Gov1']);
        Accident::factory()->count(2)->forCamera($camera)->create(['timestamp' => now()]);

        $response = $this->postJson('/api/violations/hourly', [
            'type_name' => 'حوادث',
            'governorate' => 'Gov1',
            'region' => 'Region1',
            'from_date' => now()->subDay()->toDateString(),
            'to_date' => now()->toDateString(),
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['status', 'data']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_data_by_region_for_violations()
    {
        $camera = Camera::factory()->create(['region' => 'Region1', 'governorate' => 'Gov1']);
        $violationType = ViolationType::first();

        Violation::factory()->count(4)
            ->forCamera($camera)
            ->forType($violationType)
            ->create(['timestamp' => now()]);

        $response = $this->postJson('/api/violations/by-region', [
            'type_name' => $violationType->type_name,
            'governorate' => 'Gov1',
            'from_date' => now()->subDay()->toDateString(),
            'to_date' => now()->toDateString(),
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['status', 'data']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_data_by_region_for_accidents()
    {
        $camera = Camera::factory()->create(['region' => 'Region2', 'governorate' => 'Gov2']);
        Accident::factory()->count(2)->forCamera($camera)->create(['timestamp' => now()]);

        $response = $this->postJson('/api/violations/by-region', [
            'type_name' => 'حوادث',
            'governorate' => 'Gov2',
            'from_date' => now()->subDay()->toDateString(),
            'to_date' => now()->toDateString(),
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['status', 'data']);
    }
}

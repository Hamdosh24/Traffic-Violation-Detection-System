<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// اختبار تسجيل الدخول ناجح
it('logs in with correct credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
        'user_name' => 'testuser',
        'first_name' => 'Test',
        'last_name' => 'User',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
             ->assertJsonStructure([
                 'role',
                 'access_token',
             ]);

    expect($user->fresh()->last_login_at)->not()->toBeNull();
});

// اختبار تسجيل الدخول خاطئ
it('fails login with wrong credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
        'user_name' => 'testuser',
        'first_name' => 'Test',
        'last_name' => 'User',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
             ->assertJson([
                 'message' => 'الايميل او كلمة السر خطأ',
             ]);
});

// اختبار تسجيل الخروج
it('logs out successfully', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $token = $user->createToken('authToken')->plainTextToken;

    $response = $this->postJson('/api/logout', [], [
        'Authorization' => "Bearer {$token}",
    ]);

    $response->assertStatus(200)
             ->assertJson([
                 'message' => 'تم تسجيل الخروج بنجاح',
             ]);

    // تحقق من جدول personal_access_tokens مباشرة
    $this->assertDatabaseMissing('personal_access_tokens', [
        'tokenable_id' => $user->id,
        'tokenable_type' => User::class,
    ]);
});

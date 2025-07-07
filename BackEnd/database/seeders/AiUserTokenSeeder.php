<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;

class AiUserTokenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إنشاء المستخدم الذي يمثل نظام الذكاء الاصطناعي
        $user = User::firstOrCreate(
            ['email' => 'ai-system@app.com'],
            [
                'user_name' => 'aisystem',
                'first_name' => 'AI',
                'last_name' => 'System',
                'national_num' => '99999999999',
                'phone_num' => '0999999999',
                'age' => 0,
                'gender' => 'male',
                'password' => Str::random(16) // كلمة مرور عشوائية قوية
            ]
        );

        // حذف أي Tokens قديمة لهذا المستخدم لضمان وجود Token واحد فعال
        $user->tokens()->delete();

        // إنشاء الـ Token الجديد
        $token = $user->createToken('ai-system-token')->plainTextToken;

        // طباعة الـ Token في الطرفية ليسهل نسخه
        $this->command->info('AI System User Token:');
        $this->command->warn($token);
        $this->command->info('Please copy this token and save it in a secure place.');
    }
}
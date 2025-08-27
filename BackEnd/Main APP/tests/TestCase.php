<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
// 1. استيراد الـ middleware الذي نريد تعطيله
use App\Http\Middleware\TokenExpiryMiddleware;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * يتم تشغيل هذه الدالة قبل كل اختبار.
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // 2. إضافة هذا السطر لتعطيل الـ middleware أثناء الاختبارات فقط
        $this->withoutMiddleware(TokenExpiryMiddleware::class);
    }
}

<?php

namespace Tests;

use App\Http\Middleware\TokenExpiryMiddleware;
// 1. استيراد الـ middleware الذي نريد تعطيله
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

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

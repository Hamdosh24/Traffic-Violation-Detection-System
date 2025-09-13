<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// الأمر القديم لحذف سجلات مرور السيارات
Schedule::command('app:prune-passing-cars')->daily();

// ✅ الأمر الجديد الذي أضفناه لحذف الإشعارات القديمة
Schedule::command('notifications:prune')->daily();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

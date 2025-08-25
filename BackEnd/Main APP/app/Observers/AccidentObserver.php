<?php

namespace App\Observers;

use App\Models\Accident;
use App\Models\User;
use App\Notifications\NewAccidentNotification;
use Illuminate\Support\Facades\Cache; // ✅ استيراد الكاش
use Illuminate\Support\Facades\Notification;

class AccidentObserver
{
    public function created(Accident $accident)
    {
        // ✅ الخطوة 1: ضع بيانات الحادث الجديد في الكاش لمدة دقيقة واحدة
        // قمنا بتحميل علاقة الكاميرا معها لضمان وصول البيانات كاملة
        Cache::put('latest_accident', $accident->load('camera'), now()->addMinutes(1));

        // الخطوة 2: إرسال الإشعار الداخلي للموظفين (هذه تبقى كما هي)
        $employees = User::whereHas('roles', function ($query) {
            $query->where('role_name', 'Employee');
        })->get();

        Notification::send($employees, new NewAccidentNotification($accident));
    }
}

<?php

namespace App\Observers;

use App\Models\Accident;
use App\Models\User;
use App\Notifications\NewAccidentNotification;
use App\Events\NewAccidentDetected;
use Illuminate\Support\Facades\Notification;

class AccidentObserver
{
    public function created(Accident $accident)
    {
        // 1. إطلاق الحدث للبث الفوري (SSE)
        event(new NewAccidentDetected($accident));

        // 2. إرسال الإشعار الداخلي للموظفين (لقاعدة البيانات)
        $employees = User::whereHas('roles', function ($query) {
            // Corrected to use 'role_name' based on your database screenshot
            $query->where('role_name', 'Employee');
        })->get();
        
        Notification::send($employees, new NewAccidentNotification($accident));
    }
}
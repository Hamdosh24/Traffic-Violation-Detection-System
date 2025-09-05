<?php

namespace App\Listeners;

use App\Events\NewAccidentCreated;
use App\Models\User;
use App\Notifications\NewAccidentNotification;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class StoreNotificationForEmployeesListener
{
    public function handle(NewAccidentCreated $event): void
{
    try {
        $accident = $event->accident->load('camera'); // ✅ تحميل علاقة الكاميرا

        $employees = User::whereHas('roles', function ($query) {
            $query->where('role_name', 'Employee');
        })->get();

        if ($employees->isNotEmpty()) {
            Notification::send($employees, new \App\Notifications\NewAccidentNotification($accident));
            Log::info('Notification sent to employees for accident ID: ' . $accident->id);
        } else {
            Log::info('No employees found for notification.');
        }

        // --- تخزين الحادث في الكاش مع الكاميرا ---
        $accidents = Cache::get('new_accidents', []);
        $accidents[$accident->id] = $accident;
        Cache::put('new_accidents', $accidents, now()->addMinutes(5));

    } catch (\Exception $e) {
        Log::error('Notification Error: ' . $e->getMessage());
    }
}

}

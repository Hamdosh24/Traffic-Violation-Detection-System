<?php

namespace App\Listeners;

use App\Events\NewAccidentCreated;
use App\Models\User;
use App\Notifications\NewAccidentNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Notification;

class StoreNotificationForEmployeesListener implements ShouldQueue
{
    public function handle(NewAccidentCreated $event): void
    {
        $employees = User::whereHas('roles', function ($query) {
            $query->where('role_name', 'Employee');
        })->get();

        Notification::send($employees, new NewAccidentNotification($event->accident));
    }
}

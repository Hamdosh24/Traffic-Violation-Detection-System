<?php

namespace App\Listeners;

use App\Events\NewAccidentCreated;
use App\Models\User;
use App\Notifications\NewAccidentNotification;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

/**
 * Handles the NewAccidentCreated event by sending database notifications
 * to all employees and caching the accident data using Laravel's standard cache.
 *
 * NOTE: This listener performs two distinct responsibilities and likely represents
 * an alternative or parallel notification system to the Redis-based one.
 */
class StoreNotificationForEmployeesListener
{
    /**
     * Handle the event.
     *
     * @param \App\Events\NewAccidentCreated $event The event instance.
     * @return void
     */
    public function handle(NewAccidentCreated $event): void
    {
        try {
            // Eager load the camera relationship to avoid N+1 query issues inside the notification.
            $accident = $event->accident->load('camera');

            // --- 1. Database Notification Logic ---

            // Find all users who should be notified (those with the 'Employee' role).
            $employees = User::whereHas('roles', function ($query) {
                $query->where('role_name', 'Employee');
            })->get();

            if ($employees->isNotEmpty()) {
                // Dispatch the notification to all found employees.
                // This will create a record in the 'notifications' table for each employee.
                Notification::send($employees, new NewAccidentNotification($accident));
                Log::info('Database notification queued for employees for accident ID: ' . $accident->id);
            } else {
                Log::warning('No employees found to notify for accident ID: ' . $accident->id);
            }

            // --- 2. Laravel Cache Logic (for SSE Polling) ---

            // This section caches the accident using Laravel's standard cache driver.
            // It is likely used by the SSE controller in a polling-like fashion.
            $accidents = Cache::get('new_accidents', []);
            $accidents[$accident->id] = $accident; // Use ID as key to prevent duplicates.
            Cache::put('new_accidents', $accidents, now()->addMinutes(5));

        } catch (Exception $e) {
            // Catch any potential errors during the process.
            Log::error('Failed to handle new accident notification and caching.', [
                'error'       => $e->getMessage(),
                'accident_id' => $event->accident->id,
            ]);
        }
    }
}

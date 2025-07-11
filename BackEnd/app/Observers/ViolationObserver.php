<?php

namespace App\Observers;

use App\Models\Violation;
use App\Models\User; // <-- Add this
use App\Notifications\NewAccidentNotification; // <-- Add this
use App\Notifications\NewViolationNotification; // <-- Add this
use Illuminate\Support\Facades\Notification; // <-- Add this

class ViolationObserver
{
    /**
     * Handle the Violation "created" event.
     */
    public function created(Violation $violation): void
    {
        // 1. Eager load the relationship to avoid extra database queries.
        // This is a performance best practice.
        $violation->load('violationType');

        // 2. Check if the violation type's key is 'traffic_accident'.
        if ($violation->violationType->key === 'traffic_accident') {
            // This is an accident -> Notify all employees.

            // Find all users with the 'employee' role.
            // Note: This assumes you have a 'roles' relationship set up on your User model.
            $employees = User::whereHas('roles', function ($query) {
                $query->where('role_name', 'employee'); // Or whatever the role name is
            })->get();

            // Send the accident notification to all employees.
            Notification::send($employees, new NewAccidentNotification($violation));

        } else {
            // This is a regular violation -> Notify the driver.

            // **LOGIC TO GET DRIVER INFO (Placeholder)**
            // In a real system, you would call an external API here to get the driver's
            // contact details using the plate number ($violation->plate_num).
            // For now, we will simulate it.
            // $driver = Http::get('https://traffic-api.gov/driver/' . $violation->plate_num)->json();

            // For testing, we can notify the first user in the database.
            $driver = User::first(); // Replace this with real logic later.

            if ($driver) {
                // Send the violation notification to the driver.
                $driver->notify(new NewViolationNotification($violation));
            }
        }
    }
}
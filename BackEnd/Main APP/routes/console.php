<?php

// Note: The namespace for the Kernel is typically App\Console
namespace App\Console;

use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Console\Scheduling\Schedule;

/**
 * The application's console kernel.
 *
 * This class is responsible for registering the custom Artisan commands
 * and defining the application's command schedule.
 */
class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * This method is where you define all of the automated tasks (cron jobs)
     * that should be run by the server on a regular basis.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule): void
    {
        // --- Scheduled Application Maintenance Tasks ---

        // Schedule our custom command 'app:prune-passing-cars' to run once daily.
        // This is crucial for keeping the 'passing_cars' table from growing infinitely.
        // The server's master cron job will trigger this at the appropriate time.
        $schedule->command('app:prune-passing-cars')->daily();
    }

    /**
     * Register the commands for the application.
     *
     * This method loads all the custom command classes from the Commands directory,
     * making them available to be run via `php artisan`.
     *
     * @return void
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}


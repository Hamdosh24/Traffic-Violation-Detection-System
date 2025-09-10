<?php

namespace App\Console\Commands;

use App\Models\PassingCar;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * A custom Artisan command for database maintenance.
 *
 * This command is designed to be run on a schedule (e.g., nightly)
 * to prevent the 'passing_cars' table from growing indefinitely.
 */
class PrunePassingCars extends Command
{
    /**
     * The name and signature of the console command.
     * This is how you run the command from the terminal: `php artisan app:prune-passing-cars`
     *
     * @var string
     */
    protected $signature = 'app:prune-passing-cars';

    /**
     * The console command description.
     * This description is shown when you run `php artisan list`.
     *
     * @var string
     */
    protected $description = 'Deletes records from the passing_cars table older than 48 hours';

    /**
     * Execute the console command.
     *
     * This is the main logic of the command.
     * @return void
     */
    public function handle()
    {
        $this->info('Starting to prune old passing cars records...');

        // 1. Determine the cutoff date (anything older than this will be deleted).
        $cutoffDate = Carbon::now()->subHours(48);

        // 2. Perform the delete operation.
        // This executes a single, efficient 'DELETE FROM' query on the database.
        $deletedRows = PassingCar::where('timestamp', '<', $cutoffDate)->delete();

        // 3. Log the result for monitoring and auditing purposes.
        Log::info($deletedRows . ' records were pruned from the passing_cars table.');

        // 4. Output a confirmation message to the console.
        $this->info('Done! ' . $deletedRows . ' records were pruned.');
    }
}

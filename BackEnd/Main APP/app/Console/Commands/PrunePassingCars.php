<?php

namespace App\Console\Commands;

use App\Models\PassingCar;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PrunePassingCars extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:prune-passing-cars';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes records from the passing_cars table older than 48 hours';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to prune old passing cars records...');

        // تحديد التاريخ الفاصل (قبل 48 ساعة من الآن)
        $cutoffDate = Carbon::now()->subHours(48);

        // حذف السجلات الأقدم من التاريخ الفاصل
        $deletedRows = PassingCar::where('timestamp', '<', $cutoffDate)->delete();

        Log::info($deletedRows.' records were pruned from the passing_cars table.');
        $this->info('Done! '.$deletedRows.' records were pruned.');
    }
}

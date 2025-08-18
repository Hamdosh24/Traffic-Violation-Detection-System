<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PruneOldNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:prune';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prune old notifications from the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // تحديد تاريخ القطع (أي إشعار أقدم من 7 أيام)
        $cutoffDate = now()->subDays(7);

        // حذف الإشعارات القديمة
        $deletedCount = DB::table('notifications')->where('created_at', '<', $cutoffDate)->delete();

        $this->info("Successfully pruned {$deletedCount} old notifications.");

        return 0;
    }
}
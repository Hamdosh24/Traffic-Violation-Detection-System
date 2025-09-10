<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // In Laravel 11, we don't need to require the channels file here
        // as it's loaded in bootstrap/app.php
        Broadcast::routes();
    }
}

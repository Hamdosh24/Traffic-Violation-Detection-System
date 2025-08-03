<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Camera;
use App\Observers\CameraObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Camera::observe(CameraObserver::class);
    }
}

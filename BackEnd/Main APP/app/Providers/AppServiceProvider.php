<?php

namespace App\Providers;

use App\Models\Accident;
use App\Models\PersonalAccessToken;
use App\Observers\AccidentObserver;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

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
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);
        Accident::observe(AccidentObserver::class);
    }
}

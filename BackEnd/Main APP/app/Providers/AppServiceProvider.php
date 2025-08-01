<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;
use App\Models\Violation;
use App\Observers\ViolationObserver;
use App\Models\Accident;
use App\Observers\AccidentObserver;


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
        Violation::observe(ViolationObserver::class); 
        Accident::observe(AccidentObserver::class); 
    }
}

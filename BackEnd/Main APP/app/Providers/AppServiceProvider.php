<?php

namespace App\Providers;

use App\Models\Accident;
use App\Models\PersonalAccessToken;
use App\Observers\AccidentObserver;
use Illuminate\Support\ServiceProvider;
use Laravel\Sanctum\Sanctum;

/**
 * A general-purpose service provider for bootstrapping application services.
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * This method is called after all other service providers have been registered,
     * meaning you have access to all other services at this point.
     *
     * @return void
     */
    public function boot(): void
    {
        // --- Service Configuration ---

        // Tell Laravel Sanctum to use our custom PersonalAccessToken model.
        // This is an advanced customization, often used to add extra functionality
        // or relationships to the default token model.
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        // Register the AccidentObserver with the Accident model.
        // This is the crucial step that "activates" the observer, making it
        // listen to the lifecycle events of the Accident model.
        Accident::observe(AccidentObserver::class);
    }
}

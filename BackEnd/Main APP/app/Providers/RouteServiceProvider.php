<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

/**
 * This service provider is responsible for loading the application's route files
 * and configuring its rate limiters.
 */
class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     *
     * @return void
     */
    public function boot(): void
    {
        // --- Step 1: Configure application rate limiters ---
        $this->configureRateLimiting();

        // --- Step 2: Load the route files after configuring the limiters ---
        $this->routes(function () {
            // Load the main API routes (e.g., for user auth, public endpoints).
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            // Load the system-specific API routes (e.g., for AI cameras).
            Route::middleware('api')
                ->prefix('api/system')
                ->group(base_path('routes/api/system.php'));

            // Load the admin-specific API routes (e.g., for admin panel).
            Route::middleware('api')
                ->prefix('api/admin')
                ->group(base_path('routes/api/admin.php'));

            // Load the standard web routes (for views, etc.).
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting(): void
    {
        // A standard rate limiter for most API endpoints.
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // A custom, more lenient rate limiter for Server-Sent Events (SSE).
        // It's separate because SSE connections are long-lived and require different rules.
        RateLimiter::for('sse', function (Request $request) {
            return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
        });
    }
}

<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

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
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            // This is for your main api.php file (login, etc.)
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            // THIS IS THE FIX: Load your system routes
            Route::middleware('api')
                ->prefix('api/system')
                ->group(base_path('routes/api/system.php'));

            // THIS IS THE FIX: Load your admin routes
            Route::middleware('api')
                ->prefix('api/admin')
                ->group(base_path('routes/api/admin.php'));

            // This is for your web.php file
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}

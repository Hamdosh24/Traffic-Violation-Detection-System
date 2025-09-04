<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\QueryStringTokenAuth;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
        // $middleware->alias('manager', \App\Http\Middleware\CheckManagerRole::class);
        $middleware->alias([
            'manager' => \App\Http\Middleware\CheckManagerRole::class,
            'employee' => \App\Http\Middleware\CheckEmployee::class,
            'customThrottle' => \App\Http\Middleware\CustomThrottleRequests::class,
            'token.expires' => \App\Http\Middleware\TokenExpiryMiddleware::class,
            'check.external.api_key' => \App\Http\Middleware\CheckExternalApiKey::class,
            'query.token' => \App\Http\Middleware\QueryStringTokenAuth::class,

        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->withProviders([
    App\Providers\RouteServiceProvider::class,
])

    ->create();

<?php

namespace App\Providers;

use App\Events\ViolationRecorded;
use App\Listeners\LogSuccessfulLogin;
use App\Listeners\LogSuccessfulLogout;
use App\Listeners\SendViolationNotifications;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout; // <-- إضافة جديدة
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider; // <-- إضافة جديدة

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Login::class => [
            LogSuccessfulLogin::class,
        ],
        Logout::class => [
            LogSuccessfulLogout::class,
        ],
        // <-- إضافة جديدة
        ViolationRecorded::class => [
            SendViolationNotifications::class,
        ],
    ];

    public function boot()
    {
        //
    }
}

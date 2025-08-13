<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use App\Listeners\LogSuccessfulLogin;
use App\Listeners\LogSuccessfulLogout;
use App\Events\ViolationRecorded; // <-- إضافة جديدة
use App\Listeners\SendViolationNotifications; // <-- إضافة جديدة

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
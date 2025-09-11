<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Events\NewAccidentCreated;
use App\Listeners\CacheNewAccident;
use App\Events\AccidentAcknowledged;
use App\Listeners\CacheAcknowledgedAccident;
// use App\Listeners\StoreNotificationForEmployeesListener; 


/**
 * This provider is the central registration point for all event listeners in the application.
 */
class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * This array maps event classes to the listener classes that should be executed
     * when that event is fired.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // When a user registers, send them a verification email.
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        // When a new accident is created...
        NewAccidentCreated::class => [
            // ...trigger the listener that caches it for the Redis stream.
            CacheNewAccident::class,
            // StoreNotificationForEmployeesListener::class,
        ],

        // When an accident is acknowledged...
        AccidentAcknowledged::class => [
            // ...trigger the listener that caches the acknowledgment for the Redis stream.
            CacheAcknowledgedAccident::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents(): bool
    {
        // Set to false to rely exclusively on the manual mapping in the $listen array.
        // This is often preferred for clarity and performance in larger applications.
        return false;
    }
}

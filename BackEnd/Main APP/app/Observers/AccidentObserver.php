<?php

namespace App\Observers;

use App\Events\NewAccidentCreated;
use App\Models\Accident;

/**
 * Observer for the Accident model.
 *
 * This class hooks into the lifecycle events of the Accident model
 * to perform actions automatically when these events occur.
 */
class AccidentObserver
{
    /**
     * Handle the Accident "created" event.
     *
     * This method is executed automatically by Laravel immediately after
     * a new accident record is successfully saved to the database.
     *
     * @param \App\Models\Accident $accident The newly created accident instance.
     * @return void
     */
    public function created(Accident $accident): void
    {
        // By firing an event here, we decouple the "what happened" (an accident was created)
        // from the "what to do next" (send notifications, cache data, etc.).
        // Multiple listeners can now react to this single event.
        event(new NewAccidentCreated($accident));
    }
}


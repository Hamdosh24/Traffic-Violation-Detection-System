<?php

namespace App\Events;

use App\Models\Accident;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Event fired when a user acknowledges an accident.
 *
 * This event serves as a signal to other parts of the application,
 * particularly real-time frontends, that an accident has been "claimed"
 * and its status should be updated for all observers.
 */
class AccidentAcknowledged
{
    // The Dispatchable trait allows this event to be dispatched easily.
    // The SerializesModels trait efficiently handles model serialization if the event is queued.
    use Dispatchable, SerializesModels;

    /**
     * The accident instance that was acknowledged.
     *
     * @var \App\Models\Accident
     */
    public Accident $accident;

    /**
     * Create a new event instance.
     *
     * @param \App\Models\Accident $accident The accident that was just acknowledged.
     */
    public function __construct(Accident $accident)
    {
        $this->accident = $accident;
    }
}

<?php

namespace App\Events;

use App\Models\Accident;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Fired when a new accident has been created in the system.
 *
 * This event serves as a data container for listeners that need to
 * perform actions after an accident is recorded, such as broadcasting
 * it via WebSockets for real-time dashboard updates.
 */
class NewAccidentCreated
{
    use Dispatchable, SerializesModels;

    /**
     * The newly created Accident model instance.
     *
     * @var \App\Models\Accident
     */
    public Accident $accident;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Accident  $accident The accident that was just created.
     */
    public function __construct(Accident $accident)
    {
        $this->accident = $accident;
    }
}

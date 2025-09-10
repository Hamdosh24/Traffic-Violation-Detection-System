<?php

namespace App\Events;

use App\Models\Violation;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * This event is fired when a new violation has been successfully
 * created and saved to the database.
 * It acts as a data container for listeners.
 */
class ViolationRecorded
{
    use Dispatchable, SerializesModels;

    /**
     * The violation instance that was created.
     */
    public Violation $violation;

    /**
     * Information about the driver associated with the violation.
     */
    public array $driverInfo;

    /**
     * Create a new event instance.
     */
    public function __construct(Violation $violation, array $driverInfo)
    {
        $this->violation = $violation;
        $this->driverInfo = $driverInfo;
    }
}

<?php

namespace App\Events;

use App\Models\Violation;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ViolationRecorded
{
    use Dispatchable, SerializesModels;

    public Violation $violation;
    public array $driverInfo;

    public function __construct(Violation $violation, array $driverInfo)
    {
        $this->violation = $violation;
        $this->driverInfo = $driverInfo;
    }
}
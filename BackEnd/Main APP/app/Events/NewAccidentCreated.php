<?php

namespace App\Events;

use App\Models\Accident;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewAccidentCreated
{
    use Dispatchable, SerializesModels;

    public Accident $accident;

    public function __construct(Accident $accident)
    {
        $this->accident = $accident;
    }
}

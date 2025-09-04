<?php

namespace App\Observers;

use App\Events\NewAccidentCreated;
use App\Models\Accident;

class AccidentObserver
{
    public function created(Accident $accident): void
    {
        // ✅ ما زلنا نطلق الحدث نفسه
        // event(new NewAccidentCreated($accident));
    }
}

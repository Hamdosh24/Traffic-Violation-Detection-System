<?php

namespace App\Observers;

use App\Events\NewAccidentCreated;
use App\Models\Accident;

class AccidentObserver
{
    /**
     * Handle the Accident "created" event.
     */
    public function created(Accident $accident): void
    {
        // ✅ هذا هو المكان الصحيح والوحيد لإطلاق الحدث
        broadcast(new NewAccidentCreated($accident));
    }
}

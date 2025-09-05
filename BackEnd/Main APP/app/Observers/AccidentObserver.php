<?php

namespace App\Observers;

use App\Events\NewAccidentCreated;
use App\Models\Accident;

class AccidentObserver
{
    public function created(Accident $accident): void
    {
        // إطلاق الحدث عند تسجيل حادث جديد
        event(new NewAccidentCreated($accident));
    }
}

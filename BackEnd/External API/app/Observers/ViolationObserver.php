<?php

namespace App\Observers;

use App\Models\Violation;
use App\Notifications\NewViolationNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;

class ViolationObserver
{
    // In app/Observers/ViolationObserver.php

public function created(Violation $violation): void
{
    $trafficService = app(\App\Services\TrafficAPIService::class);
    $driverInfo = $trafficService->getDriverInfoByPlate($violation->plate_num);

    if ($driverInfo && isset($driverInfo['email'])) {
        // Load the relationships before sending the notification
        $violation->load('violationType', 'camera');
        
        Notification::route('mail', $driverInfo['email'])
            ->notify(new NewViolationNotification($violation, $driverInfo));
    } else {
        Log::warning('Observer: Violation created, but no email found for the driver.');
    }
}
}
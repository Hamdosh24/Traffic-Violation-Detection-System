<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use Illuminate\Auth\Events\Logout;

class LogSuccessfulLogout
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Logout $event)
    {
        $user = $event->user;

        ActivityLog::create([
            'user_id' => $user->user_id,
            'action_type' => 'تسجيل خروج',
            'description' => "المستحدم $user->user_name قام بتسجيل الخروج",
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}

<?php

namespace App\Listeners;

use App\Models\ActivityLog;
use Illuminate\Auth\Events\Login;

class LogSuccessfulLogin
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
    public function handle(Login $event)
    {
        $user = $event->user;

        ActivityLog::create([
            'user_id' => $user->user_id,
            'action_type' => 'تسجيل دخول',
            'description' => "المستحدم $user->user_name قام بتسجيل الدخول",
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}

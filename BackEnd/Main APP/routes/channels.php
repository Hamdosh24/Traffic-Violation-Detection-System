<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

/**
 * Authorization callback for the 'accidents-channel'.
 *
 * This channel is used to broadcast real-time events related to accidents
 * to authenticated clients using WebSockets (e.g., via Laravel Echo and Pusher).
 *
 * @param \App\Models\User $user The authenticated user instance.
 * @return bool
 */
Broadcast::channel('accidents-channel', function ($user) {
    // This authorization logic is very simple:
    // It allows any user who is currently logged in to listen to this channel.
    return $user != null;
});

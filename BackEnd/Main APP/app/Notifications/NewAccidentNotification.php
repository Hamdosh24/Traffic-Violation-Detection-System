<?php

namespace App\Notifications;

use App\Models\Accident;
use Illuminate\Bus\Queueable;
// ADD THIS
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

// MODIFY THIS to implement ShouldQueue
class NewAccidentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private Accident $accident;

    public function __construct(Accident $accident)
    {
        $this->accident = $accident;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        // MODIFY THIS to send to the database channel
        return [];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'accident_id' => $this->accident->id,
            'message' => 'تنبيه: تم رصد حادث مروري جديد.',
            'camera_id' => $this->accident->camera_id,
            'timestamp' => $this->accident->timestamp,
        ];
    }
}
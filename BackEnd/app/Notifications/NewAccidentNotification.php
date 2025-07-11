<?php

namespace App\Notifications;

use App\Models\Violation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewAccidentNotification extends Notification
{
    use Queueable;

    private Violation $violation;

    /**
     * Create a new notification instance.
     */
    public function __construct(Violation $violation)
    {
        $this->violation = $violation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // إشعارات الموظفين الداخلية ستكون عبر قاعدة البيانات فقط
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        // البيانات التي نريد تخزينها في قاعدة البيانات لتظهر في لوحة التحكم
        return [
            'accident_id' => $this->violation->v_id,
            'message' => 'تنبيه: تم رصد حادث مروري جديد.',
            'camera_id' => $this->violation->camera_id,
            'timestamp' => $this->violation->timestamp,
        ];
    }
}
<?php
// app/Notifications/NewAccidentNotification.php

namespace App\Notifications;

use App\Models\Accident;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewAccidentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private Accident $accident;

    public function __construct(Accident $accident)
    {
        $this->accident = $accident;
    }

    public function via(object $notifiable): array
    {
        // <-- التعديل: تحديد وجهة الإشعار إلى قاعدة البيانات
        return ['database'];
    }

    // <-- الأفضل: إضافة دالة مخصصة لمحتوى الإشعار في قاعدة البيانات
    public function toDatabase(object $notifiable): array
    {
        return [
            'accident_id' => $this->accident->id,
            'message' => 'تنبيه: تم رصد حادث مروري جديد.',
            'camera_id' => $this->accident->camera_id,
            'timestamp' => $this->accident->timestamp,
        ];
    }
}
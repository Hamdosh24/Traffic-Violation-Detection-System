<?php

namespace App\Notifications;

use App\Models\Violation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewViolationNotification extends Notification
{
    use Queueable;

    private Violation $violation;
    private ?array $driverInfo;  // <-- 1. أضفنا متغير لمعلومات السائق
    private ?array $cameraInfo;  // <-- 2. أضفنا متغير لمعلومات الكاميرا

    /**
     * Create a new notification instance.
     * تم تحديثه ليقبل البيانات الجديدة
     */
    public function __construct(Violation $violation, ?array $driverInfo, ?array $cameraInfo)
    {
        $this->violation = $violation;
        $this->driverInfo = $driverInfo;
        $this->cameraInfo = $cameraInfo;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     * تم تحديثه ليستخدم البيانات الجديدة
     */
    public function toMail(object $notifiable): MailMessage
    {
        // نجهز اسم السائق وموقع الكاميرا لاستخدامهما في الرسالة
        $driverName = $this->driverInfo['first_name'] ?? 'سائقنا العزيز';
        $cameraLocation = $this->cameraInfo['location'] ?? $this->violation->camera_id;

        return (new MailMessage)
                    ->subject('تسجيل مخالفة مرورية جديدة')
                    ->greeting('مرحباً ' . $driverName . '،') // <-- استخدام اسم السائق
                    ->line('تم تسجيل مخالفة مرورية جديدة لمركبتكم، وفيما يلي تفاصيلها:')
                    ->line('**رقم اللوحة:** ' . $this->violation->plate_num)
                    ->line('**نوع المخالفة:** ' . $this->violation->violationType->type_name)
                    ->line('**قيمة الغرامة:** ' . $this->violation->violationType->fine_amount . ' ل.س')
                    ->line('**الموقع:** ' . $cameraLocation) // <-- استخدام موقع الكاميرا
                    ->line('**التوقيت:** ' . $this->violation->timestamp)
                    ->line('شكرًا لاستخدامك نظامنا.');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'violation_id' => $this->violation->v_id,
            'message' => 'مخالفة جديدة: ' . $this->violation->violationType->type_name,
            'plate_number' => $this->violation->plate_num,
        ];
    }
}
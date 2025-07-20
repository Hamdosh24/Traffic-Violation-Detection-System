<?php

namespace App\Notifications;

use App\Models\Violation;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// 2. الكلاس الآن يطبق الواجهة بشكل صحيح
class NewViolationNotification extends Notification
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
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // تم تبسيط دالة url هنا، وهي تعمل بنفس الطريقة
        return (new MailMessage)
                    ->subject('تسجيل مخالفة مرورية جديدة')
                    ->greeting('مرحباً،') // تغيير التحية
                    ->line('تم تسجيل مخالفة مرورية جديدة لمركبتكم، وفيما يلي تفاصيلها:')
                    ->line('**رقم اللوحة:** ' . $this->violation->plate_num)
                    ->line('**نوع المخالفة:** ' . $this->violation->violationType->type_name)
                    ->line('**قيمة الغرامة:** ' . $this->violation->violationType->fine_amount . ' ل.س')
                    ->line('**الموقع (معرف الكاميرا):** ' . $this->violation->camera_id)
                    ->line('**التوقيت:** ' . $this->violation->timestamp)
                    ->line('شكرًا لاستخدامك نظامنا.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        // هذه الدالة مهمة إذا كنت سترسل الإشعار عبر قنوات أخرى مثل broadcast
        return [
            'violation_id' => $this->violation->v_id,
            'message' => 'مخالفة جديدة: ' . $this->violation->violationType->type_name,
            'plate_number' => $this->violation->plate_num,
        ];
    }
}
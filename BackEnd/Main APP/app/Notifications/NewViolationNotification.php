<?php

namespace App\Notifications;

use App\Models\Violation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewViolationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Violation $violation;
    public array $driverInfo;

    /**
     * Create a new notification instance.
     */
    public function __construct(Violation $violation, array $driverInfo)
    {
        $this->violation = $violation;
        $this->driverInfo = $driverInfo;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        // جمع البيانات باستخدام أسماء الأعمدة الصحيحة
        $fullName = trim(($this->driverInfo['first_name'] ?? '') . ' ' . ($this->driverInfo['last_name'] ?? ''));
        $driverName = $fullName ?: 'Driver';
        
        $violationName = $this->violation->violationType->type_name ?? 'غير محدد';
        $fineAmount = $this->violation->violationType->fine_amount ?? 'غير محدد';
        $location = $this->violation->camera->location ?? 'غير محدد';

        // بناء رسالة البريد الإلكتروني باللغة العربية
        return (new MailMessage)
                    ->subject('إشعار مخالفة مرورية جديدة')
                    ->greeting('مرحباً، ' . $driverName)
                    ->line('تم تسجيل مخالفة مرورية جديدة على مركبتكم بالتفاصيل التالية:')
                    ->line('---')
                    ->line('**اسم السائق:** ' . $driverName)
                    ->line('**رقم اللوحة:** ' . $this->violation->plate_num)
                    ->line('**نوع المخالفة:** ' . $violationName)
                    ->line('**قيمة المخالفة:** ' . $fineAmount . ' ريال سعودي')
                    ->line('**الموقع:** ' . $location)
                    ->line('**التاريخ والوقت:** ' . $this->violation->timestamp)
                    ->line('---')
                    ->line('نشكر لكم تعاونكم.');
    }
}
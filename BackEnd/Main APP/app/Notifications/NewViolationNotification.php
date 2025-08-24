<?php

namespace App\Notifications;

use App\Models\Violation;
use App\Support\ViolationMessageBuilder; // <-- 1. استيراد الـ Builder
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewViolationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Violation $violation;

    public array $driverInfo;

    public function __construct(Violation $violation, array $driverInfo)
    {
        $this->violation = $violation;
        $this->driverInfo = $driverInfo;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        // <-- 2. تم حذف `loadMissing` من هنا لأن البيانات تأتي جاهزة

        // <-- 3. استخدام دوال مساعدة من الـ Builder لتوحيد المنطق
        $driverName = ViolationMessageBuilder::getDriverFullName($this->driverInfo) ?: 'السائق الكريم';
        $location = ViolationMessageBuilder::getViolationLocation($this->violation);

        $violationName = $this->violation->violationType?->type_name ?? 'غير محدد';
        $fineAmount = $this->violation->violationType?->fine_amount ?? 'غير محدد';

        // بناء رسالة البريد الإلكتروني
        return (new MailMessage)
            ->subject('إشعار مخالفة مرورية جديدة')
            ->greeting('مرحباً، '.$driverName)
            ->line('تم تسجيل مخالفة مرورية جديدة على مركبتكم بالتفاصيل التالية:')
            ->line('---')
            ->line('**اسم السائق:** '.$driverName)
            ->line('**رقم اللوحة:** '.$this->violation->plate_num)
            ->line('**نوع المخالفة:** '.$violationName)
            ->line('**قيمة المخالفة:** '.$fineAmount.' ليرة')
            ->line('**الموقع:** '.($location ?: 'غير محدد'))
            ->line('**التاريخ والوقت:** '.$this->violation->timestamp)
            ->line('---')
            ->line('نشكر لكم تعاونكم.');
    }
}

<?php

namespace App\Notifications;

use App\Models\Violation;
use App\Support\ViolationMessageBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Sends an email notification to a user about a new traffic violation.
 *
 * This notification is designed to be queued for better application performance.
 */
class NewViolationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * The violation instance.
     * Contains all data about the violation event.
     */
    public Violation $violation;

    /**
     * Information about the driver.
     */
    public array $driverInfo;

    /**
     * Create a new notification instance.
     *
     * @param  \App\Models\Violation  $violation  The violation model instance.
     * @param  array  $driverInfo  Associated driver information.
     */
    public function __construct(Violation $violation, array $driverInfo)
    {
        $this->violation = $violation;
        $this->driverInfo = $driverInfo;
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
     * Build the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Use helper methods from the builder for consistent message formatting.
        $driverName = ViolationMessageBuilder::getDriverFullName($this->driverInfo) ?: 'السائق الكريم';
        $location = ViolationMessageBuilder::getViolationLocation($this->violation);

        // Safely access related properties using the nullsafe operator (?->).
        $violationName = $this->violation->violationType?->type_name ?? 'غير محدد';
        $fineAmount = ($this->violation->violationType?->fine_amount / 100) ?? 'غير محدد';

        return (new MailMessage)
            ->subject('إشعار مخالفة مرورية جديدة')
            ->greeting('مرحباً، '.$driverName)
            ->line('تم تسجيل مخالفة مرورية جديدة على مركبتكم بالتفاصيل التالية:')
            ->line('---')
            ->line('**رقم اللوحة:** '.$this->violation->plate_num)
            ->line('**نوع المخالفة:** '.$violationName)
            ->line('**قيمة المخالفة:** '.$fineAmount.' ليرة')
            ->line('**الموقع:** '.($location ?: 'غير محدد'))
            ->line('**التاريخ والوقت:** '.$this->violation->timestamp)
            ->line('---')
            ->line('نشكر لكم تعاونكم.');
    }
}

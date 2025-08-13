<?php

namespace App\Listeners;

use App\Events\ViolationRecorded;
use App\Notifications\NewViolationNotification;
use App\Services\TelegramService;
use App\Support\ViolationMessageBuilder; // <-- 1. استيراد الـ Builder
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendViolationNotifications implements ShouldQueue
{
    use InteractsWithQueue;

    protected TelegramService $telegramService;

    public function __construct(TelegramService $telegramService)
    {
        $this->telegramService = $telegramService;
    }

    public function handle(ViolationRecorded $event): void
    {
        // 1. إرسال إشعار البريد الإلكتروني (لا تغيير هنا)
        if (isset($event->driverInfo['email'])) {
            Notification::route('mail', $event->driverInfo['email'])
                ->notify(new NewViolationNotification($event->violation, $event->driverInfo));
        }

        // 2. إرسال إشعار Telegram
        // <-- 2. استدعاء الـ Builder للحصول على الرسالة بدلاً من بنائها هنا
        $message = ViolationMessageBuilder::buildTelegramMessage($event->violation, $event->driverInfo);
        
        $this->telegramService->sendMessage($message);
    }
}
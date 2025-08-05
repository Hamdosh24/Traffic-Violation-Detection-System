<?php

namespace App\Observers;

use App\Models\Violation;
use App\Notifications\NewViolationNotification;
use App\Services\TelegramService;
use App\Services\TrafficAPIService;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;

class ViolationObserver
{
    protected $trafficService;
    protected $telegramService;

    public function __construct(TrafficAPIService $trafficService, TelegramService $telegramService)
    {
        $this->trafficService = $trafficService;
        $this->telegramService = $telegramService;
    }

    public function created(Violation $violation): void
    {
        $driverInfo = $this->trafficService->getDriverInfoByPlate($violation->plate_num);

        if (!$driverInfo) {
            Log::warning("Observer: Violation created, but driver info not found for plate: {$violation->plate_num}");
            return;
        }

        $violation->load('violationType', 'camera');
        
        // منطق إرسال البريد الإلكتروني (يبقى كما هو)
        if (isset($driverInfo['email'])) {
            Notification::route('mail', $driverInfo['email'])
                ->notify(new NewViolationNotification($violation, $driverInfo));
        }

        // --- ✨ بداية التعديلات المطلوبة ✨ ---

        // 1. تجميع اسم السائق بشكل صحيح
        $driverName = trim(($driverInfo['first_name'] ?? '') . ' ' . ($driverInfo['last_name'] ?? ''));

        // 2. تجميع موقع وصفي من البيانات المتاحة في الكاميرا
        $cameraLocation = collect([
            $violation->camera->governorate,
            $violation->camera->region,
            $violation->camera->street,
        ])->filter()->implode('، '); // filter() لإزالة أي قيم فارغة

        // 3. بناء الرسالة بالبيانات المجمعة
        $message = "*تم تسجيل مخالفة جديدة* 🚗\n\n";
        $message .= "*اسم السائق:* " . ($driverName ?: 'غير متوفر') . "\n";
        $message .= "*رقم اللوحة:* " . $violation->plate_num . "\n";
        $message .= "*نوع المخالفة:* " . $violation->violationType->type_name . "\n";
        $message .= "*قيمة الغرامة:* " . $violation->violationType->fine_amount . " ليرة \n";
        $message .= "*الموقع:* " . ($cameraLocation ?: 'غير محدد') . "\n"; // استخدام الموقع المجمع
        $message .= "*الوقت:* " . $violation->timestamp;
        
        $this->telegramService->sendMessage($message);

        // --- 🔚 نهاية التعديلات المطلوبة 🔚 ---
    }
}
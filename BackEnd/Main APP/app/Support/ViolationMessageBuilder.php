<?php

namespace App\Support;

use App\Models\Violation;

class ViolationMessageBuilder
{
    /**
     * يقوم ببناء نص رسالة Telegram.
     */
    public static function buildTelegramMessage(Violation $violation, array $driverInfo): string
    {
        $driverName = self::getDriverFullName($driverInfo);
        $location = self::getViolationLocation($violation);

        return "*تم تسجيل مخالفة جديدة* 🚗\n\n"
            .'*اسم السائق:* '.($driverName ?: 'غير متوفر')."\n"
            .'*رقم اللوحة:* '.$violation->plate_num."\n"
            .'*نوع المخالفة:* '.$violation->violationType?->type_name."\n"
            .'*قيمة الغرامة:* '.$violation->violationType?->fine_amount." ليرة \n"
            .'*الموقع:* '.($location ?: 'غير محدد')."\n"
            .'*الوقت:* '.$violation->timestamp;
    }

    /**
     * يقوم بتجميع الاسم الكامل للسائق.
     */
    public static function getDriverFullName(array $driverInfo): string
    {
        return trim(($driverInfo['first_name'] ?? '').' '.($driverInfo['last_name'] ?? ''));
    }

    /**
     * يقوم بتجميع موقع المخالفة كنص.
     */
    public static function getViolationLocation(Violation $violation): string
    {
        return collect([
            $violation->camera?->governorate,
            $violation->camera?->region,
            $violation->camera?->street,
        ])->filter()->implode('، ');
    }
}

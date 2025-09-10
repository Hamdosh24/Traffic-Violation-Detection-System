<?php

namespace App\Support;

use App\Models\Violation;

/**
 * A helper class responsible for building formatted, human-readable messages
 * related to violations. This centralizes all string formatting logic,
 * making it consistent and easy to modify.
 */
class ViolationMessageBuilder
{
    /**
     * Builds a formatted text message for sending via Telegram.
     *
     * @param  \App\Models\Violation  $violation  The violation model instance.
     * @param  array  $driverInfo  An array containing driver details.
     * @return string The formatted message ready for Telegram (with Markdown).
     */
    public static function buildTelegramMessage(Violation $violation, array $driverInfo): string
    {
        $driverName = self::getDriverFullName($driverInfo);
        $location = self::getViolationLocation($violation);

        // Best Practice: Convert the stored integer value (in hellalas/cents)
        // back to a readable decimal format for display.
        $fineAmount = number_format(($violation->violationType?->fine_amount ?? 0) / 100, 2);

        return "*تم تسجيل مخالفة جديدة* 🚗\n\n"
            .'*اسم السائق:* '.($driverName ?: 'غير متوفر')."\n"
            .'*رقم اللوحة:* '.$violation->plate_num."\n"
            .'*نوع المخالفة:* '.($violation->violationType?->type_name ?? 'غير محدد')."\n"
            .'*قيمة الغرامة:* '.$fineAmount." ليرة\n" // Use the formatted amount
            .'*الموقع:* '.($location ?: 'غير محدد')."\n"
            .'*الوقت:* '.$violation->timestamp;
    }

    /**
     * Safely concatenates the driver's first and last name.
     *
     * @param  array  $driverInfo  An array containing 'first_name' and 'last_name' keys.
     * @return string The full name, or an empty string if no name parts are available.
     */
    public static function getDriverFullName(array $driverInfo): string
    {
        // The null coalescing operator (??) ensures we don't get errors if keys are missing.
        // trim() removes any leading/trailing whitespace if one of the names is empty.
        return trim(($driverInfo['first_name'] ?? '').' '.($driverInfo['last_name'] ?? ''));
    }

    /**
     * Assembles a clean, readable location string from the camera's address parts.
     *
     * @param  \App\Models\Violation  $violation  The violation model instance.
     * @return string A formatted location string, e.g., "Damascus, Al-Midan, Main Street".
     */
    public static function getViolationLocation(Violation $violation): string
    {
        // This is an elegant way to build a string from potentially null parts.
        return collect([
            $violation->camera?->governorate,
            $violation->camera?->region,
            $violation->camera?->street,
        ])->filter()->implode('، '); // filter() removes all null/empty values before implode()
    }
}

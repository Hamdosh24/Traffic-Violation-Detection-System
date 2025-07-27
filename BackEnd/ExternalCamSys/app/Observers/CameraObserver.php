<?php

namespace App\Observers;

use App\Models\Camera;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CameraObserver
{
    /**
     * Handle the Camera "created" event.
     */
    public function created(Camera $camera): void
    {
        // 1. تحضير بيانات الكاميرا التي سيتم إرسالها
        $data = [
            'camera_id' => $camera->camera_id,
            'region' => $camera->region,
            'governorate' => $camera->governorate,
            'street' => $camera->street,
            'coordinates' => $camera->coordinates,
            'key' => $camera->key,
        ];

        // 2. رابط النظام الآخر (API endpoint) اللي راح تستقبل البيانات
        $url = 'https://example.com/api/cameras';

        // 3. إرسال البيانات باستخدام POST
        try {
            $response = Http::post($url, $data);

            // 4. التحقق إذا الطلب فشل
            if ($response->failed()) {
                \Log::error('Failed to send camera data', [
                    'camera_id' => $camera->camera_id,
                    'response' => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            // 5. تسجيل الأخطاء في حالة حدوث استثناء (Exception)
            \Log::error('Exception while sending camera data', [
                'camera_id' => $camera->camera_id,
                'message' => $e->getMessage(),
            ]);
        }
    }


    /**
     * Handle the Camera "updated" event.
     */
    public function updated(Camera $camera): void
    {
        //
    }

    /**
     * Handle the Camera "deleted" event.
     */
    public function deleted(Camera $camera): void
    {
        //
    }

    /**
     * Handle the Camera "restored" event.
     */
    public function restored(Camera $camera): void
    {
        //
    }

    /**
     * Handle the Camera "force deleted" event.
     */
    public function forceDeleted(Camera $camera): void
    {
        //
    }
}

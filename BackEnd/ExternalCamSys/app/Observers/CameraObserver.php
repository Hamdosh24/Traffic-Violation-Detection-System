<?php

namespace App\Observers;

use App\Models\Camera;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CameraObserver
{
    /**
     * عند الإنشاء أو التعديل
     */
    public function saved(Camera $camera): void
    {
        $data = [
            'external_id' => $camera->camera_id,
            'region' => $camera->region,
            'governorate' => $camera->governorate,
            'street' => $camera->street,
            'coordinates' => $camera->coordinates,
            'rtsp_url' => $camera->rtsp_url,
            'hls_path' => $camera->hls_path,
            'status' => $camera->status,
        ];

        try {
            $response = Http::withHeaders([
                'X-API-KEY' => config('services.receiver.api_key'),
            ])->timeout(120)->post(config('services.receiver.url'), $data);

            if ($response->failed()) {
                Log::error('Failed to send camera data', [
                    'response' => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception while sending camera data', [
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * عند الحذف
     */
    public function deleted(Camera $camera): void
    {
        try {
            $response = Http::withHeaders([
                'X-API-KEY' => config('services.receiver.api_key'),
            ])->timeout(120)->delete(config('services.receiver.url') . '/' . $camera->camera_id);

            if ($response->failed()) {
                Log::error('Failed to send camera delete request', [
                    'response' => $response->body(),
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception while sending camera delete request', [
                'message' => $e->getMessage(),
            ]);
        }
    }
}

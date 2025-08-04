<?php

namespace App\Observers;

use App\Models\Camera;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CameraObserver
{
    public function created(Camera $camera): void
    {
        $data = [
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
                'X-API-KEY' => config('services.receiver.api_key'), // الأفضل تخزينه في .env
                // 'Authorization' => 'Bearer ' . env('CAMERA_RECEIVER_TOKEN'),
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
}

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
            'key' => $camera->key,
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('CAMERA_RECEIVER_TOKEN'),
            ])->post(env('CAMERA_RECEIVER_URL'), $data);

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

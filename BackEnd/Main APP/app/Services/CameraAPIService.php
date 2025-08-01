<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CameraAPIService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.traffic_api.url');
    }

    public function getAllCameras(): ?array
    {
        $response = Http::acceptJson()->get($this->baseUrl . '/cameras');
        return $response->successful() ? $response->json() : null;
    }

    public function getCameraById(string $cameraId): ?array
    {
        $response = Http::acceptJson()->get($this->baseUrl . '/cameras/' . $cameraId);
        return $response->successful() ? $response->json() : null;
    }
}
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TrafficAPIService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.traffic_api.url');
    }

    public function getDriverInfoByPlate(string $plateNumber): ?array
    {
        $response = Http::acceptJson()->get($this->baseUrl . '/drivers/' . $plateNumber);
        return $response->successful() ? $response->json() : null;
    }
}
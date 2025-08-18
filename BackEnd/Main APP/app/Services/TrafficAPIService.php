<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
// ✅ Add these specific Exception types
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\ConnectionException;

class TrafficAPIService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.traffic_api.url');
    }

    public function getDriverInfoByPlate(string $plateNumber): ?array
    {
        $cacheKey = 'driver_info:' . $plateNumber;

        // ✅ You can now safely re-enable the cache
        return Cache::remember($cacheKey, now()->addHours(24), function () use ($plateNumber) {
            try {
                $response = Http::acceptJson()
                                ->timeout(8)
                                ->retry(2, 100)
                                ->get($this->baseUrl . '/drivers/' . $plateNumber);

                // This will throw an exception on 4xx/5xx errors, which we now handle below.
                // If we get here, it means the status code was successful (2xx).
                return $response->json();

            } catch (RequestException $e) {
                // ✅ This is the intelligent error handling block.
                // This block runs when the API returns an error status code (4xx or 5xx).

                if ($e->response && $e->response->status() === 404) {
                    // This is a "Not Found" error. It's an expected outcome, not a failure.
                    Log::info('Driver not found via Traffic API.', ['plate' => $plateNumber]);
                    return []; // Return an empty array.
                }

                // For any other status code error (like 500), it's a true service failure.
                Log::error('Traffic API request failed with a status code.', [
                    'plate_number' => $plateNumber,
                    'status' => $e->response ? $e->response->status() : 'N/A',
                    'error_message' => $e->getMessage()
                ]);
                return null; // Return null to indicate failure.

            } catch (ConnectionException $e) {
                // This block runs for network-level problems (e.g., cURL error 7, timeouts).
                Log::error('Traffic API connection failed.', [
                    'plate_number' => $plateNumber,
                    'error_message' => $e->getMessage()
                ]);
                return null; // Return null to indicate failure.
            }
        });
    }
}
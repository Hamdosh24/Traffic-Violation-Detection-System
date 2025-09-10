<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * A robust client for interacting with the external Traffic Information API.
 * This class encapsulates all logic related to fetching driver data,
 * including caching, retries, and intelligent error handling.
 */
class TrafficAPIService
{
    /**
     * The base URL for the Traffic API.
     */
    protected string $baseUrl;

    /**
     * Create a new service instance.
     */
    public function __construct()
    {
        // Load the API URL from the services configuration file.
        // This is a best practice to keep credentials and URLs out of the code.
        $this->baseUrl = config('services.traffic_api.url');
    }

    /**
     * Get driver information by their license plate number.
     *
     * @param  string  $plateNumber  The license plate to look up.
     * @return array|null Returns an array of driver info on success (can be empty for 404),
     *                    or null if a critical API failure occurs.
     */
    public function getDriverInfoByPlate(string $plateNumber): ?array
    {
        $cacheKey = 'driver_info:'.$plateNumber;

        // Use the cache to avoid redundant API calls for the same plate number.
        // If data is in the cache, it's returned immediately.
        // Otherwise, the closure is executed, and its result is cached for 24 hours.
        return Cache::remember($cacheKey, now()->addHours(24), function () use ($plateNumber) {
            try {
                $response = Http::acceptJson()
                    ->timeout(8) // Wait a maximum of 8 seconds for a response.
                    ->retry(2, 100) // Retry 2 times with a 100ms delay if the request fails.
                    ->get($this->baseUrl.'/drivers/'.$plateNumber);

                // This will automatically throw a RequestException on 4xx/5xx errors.
                $response->throw();

                // If we reach here, the status code was successful (2xx).
                return $response->json();

            } catch (RequestException $e) {
                // This block handles errors where the API responded with a 4xx or 5xx status code.
                if ($e->response->status() === 404) {
                    // 404 (Not Found) is an expected outcome, not a system failure.
                    // It simply means the driver does not exist.
                    Log::info('Driver not found via Traffic API.', ['plate' => $plateNumber]);

                    return []; // Return an empty array to signify "found nothing".
                }

                // Any other status code (like 500 Internal Server Error) is a true failure.
                Log::error('Traffic API request failed with a status code.', [
                    'plate_number' => $plateNumber,
                    'status' => $e->response->status(),
                    'error' => $e->getMessage(),
                ]);

                return null; // Return null to indicate a critical failure.

            } catch (ConnectionException $e) {
                // This block handles network-level problems (e.g., DNS issues, timeouts).
                Log::error('Could not connect to the Traffic API.', [
                    'plate_number' => $plateNumber,
                    'error' => $e->getMessage(),
                ]);

                return null; // Return null to indicate a critical failure.
            }
        });
    }
}

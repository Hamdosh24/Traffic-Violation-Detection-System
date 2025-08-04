<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckExternalApiKey
{
    public function handle(Request $request, Closure $next)
    {
        $providedKey = $request->header('X-API-KEY');
        $validKey = config('services.external_system.api_key');

        if (!$providedKey || $providedKey !== $validKey) {
            return response()->json(['message' => 'Unauthorized. Invalid API Key.'], 401);
        }

        return $next($request);
    }
}

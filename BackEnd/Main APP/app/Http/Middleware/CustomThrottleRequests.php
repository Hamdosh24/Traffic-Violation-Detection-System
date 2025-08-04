<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class CustomThrottleRequests
{
    public function handle(Request $request, Closure $next, $maxAttempts = 5, $decayMinutes = 1)
    {
        $key = $this->resolveRequestSignature($request);

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            $retryAfter = RateLimiter::availableIn($key);

            return response()->json([
                'message' => 'لقد تجاوزت عدد محاولات الدخول المسموح بها. الرجاء المحاولة بعد ' . $retryAfter . ' ثانية.',
            ], Response::HTTP_TOO_MANY_REQUESTS);
        }

        RateLimiter::hit($key, $decayMinutes * 60);

        return $next($request);
    }

    protected function resolveRequestSignature(Request $request)
    {
        return sha1($request->ip() . '|' . $request->path());
    }
}

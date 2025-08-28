<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class QueryStringTokenAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->query('token');

        // تحقق من وجود التوكن وصحته
        $accessToken = $token ? PersonalAccessToken::findToken($token) : null;

        if (!$accessToken) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // اربط المستخدم بالمصادقة
$request->setUserResolver(function () use ($accessToken) {
    return $accessToken->tokenable;
});

        return $next($request);
    }
}

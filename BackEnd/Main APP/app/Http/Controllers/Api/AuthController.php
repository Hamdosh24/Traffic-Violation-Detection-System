<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Events\Logout;


class AuthController extends Controller
{
    /**
     * Handle a login request to the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('authToken')->plainTextToken;
            $role = $user->roles()->first()?->role_name ?? 'unknown';

            return response()->json([
                'role' => $role,
                'access_token' => $token,
            ]);
        }

        return response()->json(['message' => 'الايميل او كلمة السر خطأ'], 401);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user && $user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        // إطلاق الحدث يدويًا من اجل الlistener
        event(new Logout('web', $user));

        return response()->json(['message' => 'تم تسجيل الخروج بنجاح']);
    }
}
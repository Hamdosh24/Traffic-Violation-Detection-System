<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ActivityLogController extends Controller
{

    // عرض جميع الlogs مع اسم المستخدم.
    public function index(Request $request)
    {
        try {
            $logs = ActivityLog::with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($log){
                    return [
                        'user_name' => $log->user ? $log->user->user_name : null,
                        'action' => $log->action_type,
                        'description' => $log->description,
                        'model_type' => $log->model_type,
                        'time' => $log->created_at->toDateTimeString(),
                    ];
                });

            ActivityLog::create([
                'user_id'     => Auth::user()->id ?? null,
                'action_type' => 'view',
                'description' => 'Viewed activity logs.',
                'model_type'  => 'ActivityLog',
                'model_id'    => null,
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            return response()->json($logs);
        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ أثناء جلب السجلات: ' . $e->getMessage()], 500);
        }
    }


    //البحث باسم المستخدم.
    public function search(Request $request)
    {
        try {
            $request->validate([
                'query' => 'required|string',
            ]);

            $search = $request->query('query');

            $logs = ActivityLog::whereHas('user', function ($q) use ($search) {
                    $q->where('user_name', 'like', '%' . $search . '%');
                })
                ->with('user')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($log){
                    return [
                        'user_name' => $log->user ? $log->user->user_name : null,
                        'action' => $log->action_type,
                        'description' => $log->description,
                        'model_type' => $log->model_type,
                        'time' => $log->created_at->toDateTimeString(),
                    ];
                });

            ActivityLog::create([
                'user_id'     => Auth::user()->id ?? null,
                'action_type' => 'view',
                'description' => 'Searched activity logs for user: ' . $search,
                'model_type'  => 'ActivityLog',
                'model_id'    => null,
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            return response()->json($logs);
        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ أثناء البحث في السجلات: ' . $e->getMessage()], 500);
        }
    }
}
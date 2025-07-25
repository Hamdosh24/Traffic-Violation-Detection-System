<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;
use App\Models\User;

class ActivityLogController extends Controller
{
    /**
     * عرض جميع الlogs مع اسم المستخدم.
     */
    public function index()
    {
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

        return response()->json($logs);
    }

    /**
     * البحث باسم المستخدم.
     */
    public function search(Request $request)
    {
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

        return response()->json($logs);
    }
}

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

    // فلترة النشاطات حسب خيارات المستخدم (اسم، اجراء، كلاهما)
    public function filteredLogs(Request $request)
    {
        try {
            $query = ActivityLog::query()->with('user');

            // فلترة حسب اسم المستخدم
            if ($request->username && $request->username !== 'all') {
                $query->whereHas('user', function ($q) use ($request) {
                    $q->where('name', $request->username);
                });
            }

            // فلترة حسب نوع الإجراء
            if ($request->action && $request->action !== 'all') {
                $query->where('action_type', $request->action);
            }

            // تنفيذ الاستعلام
            $logs = $query->orderBy('created_at', 'desc')->get();

            // تنسيق البيانات للإرجاع
            $result = $logs->map(function ($log) {
                return [
                    'user_name'    => $log->user?->name ?? 'Unknown',
                    'action'       => $log->action_type,
                    'description'  => $log->description,
                    'model_type'   => $log->model_type,
                    'time'         => $log->created_at->toDateTimeString(),
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

            return response()->json($result, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }
}
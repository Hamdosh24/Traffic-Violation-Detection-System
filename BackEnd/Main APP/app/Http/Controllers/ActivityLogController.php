<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ActivityLogController extends Controller
{
    public function getLogs(Request $request)
    {
        try {
            // أولًا تحقق من المدخلات (validation)
            $validated = $request->validate([
                'action'    => 'nullable|string',
                'username'  => 'nullable|string',
                'from_time' => 'nullable|date',
                'to_time'   => 'nullable|date',
            ]);

            // قراءة القيم بعد التحقق
            $actionType = $validated['action'] ?? 'all';
            $username = $validated['username'] ?? 'all';
            $fromTime = isset($validated['from_time']) ? Carbon::parse($validated['from_time']) : Carbon::now()->subDay();
            $toTime = isset($validated['to_time']) ? Carbon::parse($validated['to_time']) : Carbon::now();

            // بناء الاستعلام
            $query = ActivityLog::with('user');

            if ($actionType !== 'all') {
                $query->where('action_type', $actionType);
            }

            if ($username !== 'all') {
                $user = User::where('user_name', $username)->first();

                if (!$user) {
                    return response()->json([
                        'error' => "المستخدم $username غير موجود.",
                    ], 404);
                }

                $query->where('user_id', $user->user_id);
            }

            $query->whereBetween('created_at', [$fromTime, $toTime]);

            $logs = $query->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($log) {
                    return [
                        'user_name'   => $log->user ? $log->user->user_name : null,
                        'action'      => $log->action_type,
                        'description' => $log->description,
                        'model_type'  => $log->model_type,
                        'time'        => $log->created_at->toDateTimeString(),
                    ];
                });

            // تسجيل العملية في جدول activity_logs
            $description = sprintf(
                "Viewed activity logs with filters: action = %s, username = %s, from = %s, to = %s. Returned %d records.",
                $actionType,
                $username,
                $fromTime->toDateTimeString(),
                $toTime->toDateTimeString(),
                $logs->count()
            );

            ActivityLog::create([
                'user_id'     => Auth::user()->user_id ?? null,
                'action_type' => 'View Activity Log',
                'description' => $description,
                'model_type'  => 'ActivityLog',
                'model_id'    => null,
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            return response()->json($logs);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // إرجاع أخطاء التحقق بصيغة JSON وكود 422
            return response()->json([
                'errors' => $e->errors(),
            ], 422);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => 'حدث خطأ أثناء جلب السجلات.',
                'message' => $e->getMessage(), // في بيئة الإنتاج يفضل عدم إرسال رسالة الخطأ التفصيلية
            ], 500);
        }
    }

}

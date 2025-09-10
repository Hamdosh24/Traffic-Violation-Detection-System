<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityLogController extends Controller
{
    public function getLogs(Request $request)
    {
        try {
            // أولًا تحقق من المدخلات (validation)
            $validated = $request->validate([
                'action' => 'nullable|string',
                'username' => 'nullable|string',
                'from_time' => 'nullable|date',
                'to_time' => 'nullable|date',
            ]);

            // قراءة القيم بعد التحقق
            $actionType = $validated['action'] ?? 'كل الاحداث';
            $username = $validated['username'] ?? 'كل المستخدمين';

            $fromTime = isset($validated['from_time']) ? Carbon::parse($validated['from_time'])->startOfDay() : Carbon::now()->startOfDay();
            $toTime = isset($validated['to_time']) ? Carbon::parse($validated['to_time'])->endOfDay() : Carbon::now()->endOfDay();

            // بناء الاستعلام
            $query = ActivityLog::with('user');

            if ($actionType !== 'كل الاحداث') {
                $query->where('action_type', $actionType);
            }

            if ($username !== 'كل المستخدمين') {
                $users = User::where('user_name', 'LIKE', '%'.$username.'%')->pluck('user_id');

                if ($users->isEmpty()) {
                    return response()->json(['error' => "لا يوجد مستخدم يحتوي اسمه على: $username",], 404);
                }

                $query->whereIn('user_id', $users);
            }

            $query->whereBetween('created_at', [$fromTime, $toTime]);

            $logs = $query->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($log) {
                    return [
                        'user_name' => $log->user ? $log->user->user_name : null,
                        'action' => $log->action_type,
                        'description' => $log->description,
                        'model_type' => $log->model_type,
                        'time' => $log->created_at->toDateTimeString(),
                    ];
                });

            ActivityLog::create([
                'user_id' => Auth::user()->user_id ?? null,
                'action_type' => 'عرض سجل الانشطة',
                'description' => "عرض سجل الانشطة حسب الفلاتر: نوع الحدث = {$actionType}, اسم المستخدم = {$username}, من الوقت = {$fromTime}, لإلى الوقت = {$toTime}.",
                'model_type' => 'ActivityLog',
                'model_id' => null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
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

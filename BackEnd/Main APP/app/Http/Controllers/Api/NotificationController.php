<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()
                                 ->notifications()
                                 ->where('created_at', '>=', now()->subHours(24))
                                 ->latest()
                                 ->paginate(20);

        if ($notifications->isEmpty()) {
            return response()->json(['message' => 'لا توجد إشعارات لعرضها في آخر 24 ساعة.']);
        }
        
        return NotificationResource::collection($notifications)->response();
    }

    public function unread(Request $request): JsonResponse
    {
        $notifications = $request->user()
                                 ->unreadNotifications()
                                 // ✅ أضف هذا الشرط لجلب إشعارات آخر 24 ساعة فقط
                                 ->where('created_at', '>=', now()->subHours(24))
                                 ->latest()
                                 ->paginate(20);

        if ($notifications->isEmpty()) {
            return response()->json(['message' => 'لا توجد إشعارات جديدة لعرضها في آخر 24 ساعة.']);
        }

        return NotificationResource::collection($notifications)->response();
    }

    public function markAsRead(Request $request, string $notificationId): JsonResponse
    {
        $notification = $request->user()
                                ->notifications()
                                ->where('id', $notificationId)
                                ->first();

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['message' => 'Notification marked as read.']);
        }

        return response()->json(['message' => 'Notification not found.'], 404);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        // ✅ الأفضل هو تحديد الإشعارات غير المقروءة في آخر 24 ساعة فقط
        $request->user()
               ->unreadNotifications()
               ->where('created_at', '>=', now()->subHours(24))
               ->update(['read_at' => now()]);

        return response()->json(['message' => 'All recent unread notifications have been marked as read.']);
    }
}
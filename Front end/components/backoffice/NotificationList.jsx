"use client";
import { Bell } from "lucide-react";
import NotificationCard from "./NotificationCard";

export default function NotificationList({
  notifications,
  loading,
  onMarkAsRead,
}) {
  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-xl shadow-sm backdrop-blur-sm animate-pulse"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-200/80 dark:bg-gray-700/80"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200/80 dark:bg-gray-700/80 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200/80 dark:bg-gray-700/80 rounded w-1/2"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200/80 dark:bg-gray-700/80 rounded-full w-20"></div>
                  <div className="h-6 bg-gray-200/80 dark:bg-gray-700/80 rounded-full w-24"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200/80 dark:bg-gray-700/80 rounded w-16"></div>
                  <div className="h-4 bg-gray-200/80 dark:bg-gray-700/80 rounded w-12"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-gray-100/50 dark:bg-gray-700/50 p-5 rounded-full mb-4 backdrop-blur-sm">
          <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">
          لا توجد إشعارات جديدة
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          سيظهر هنا أي إشعارات جديدة تتلقاها مثل الحوادث المرورية أو التنبيهات
          المهمة
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-2">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}

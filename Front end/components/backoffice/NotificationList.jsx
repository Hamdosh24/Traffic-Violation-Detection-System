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
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md animate-pulse"
          >
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="h-10 bg-gray-200 dark:bg-gray-700 rounded"
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
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
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full mb-4">
          <Bell className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">
          لا توجد إشعارات جديدة
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          سيتم إعلامك هنا عند وجود أي إشعارات جديدة
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="hover:shadow-lg transition-shadow duration-200 rounded-xl"
          onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
        >
          <NotificationCard
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        </div>
      ))}
    </div>
  );
}

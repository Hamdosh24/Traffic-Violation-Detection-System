"use client";
import { useState, useEffect } from "react";
import { BellRingIcon } from "lucide-react";
import NotificationList from "@/components/backoffice/NotificationList";
import useNotificationStore from "@/stores/notificationStore";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    setupSSEConnection,
    cleanupSSE,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    setupSSEConnection();

    return () => {
      cleanupSSE();
    };
  }, [setupSSEConnection, cleanupSSE]);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "read") return notification.isRead;
    if (filter === "unread") return !notification.isRead;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="relative">
            <BellRingIcon className="h-8 w-8 text-customGreen mr-2" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            الإشعارات
          </h1>
        </div>

        <button
          onClick={markAllAsRead}
          className="px-3 py-2 font-bold bg-customGreen text-white rounded hover:bg-customGreen/80 text-sm"
          disabled={unreadCount === 0 || isLoading}
        >
          {isLoading ? "جاري المعالجة..." : "تعيين الكل كمقروء"}
        </button>
      </div>

      <div className="flex items-center mb-4 gap-2">
        <div className="relative inline-block">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none p-2 pr-8 text-sm border rounded bg-white font-bold dark:bg-customDarkGreen focus:outline-none focus:ring-2 focus:ring-customGreen"
          >
            <option value="all">الكل</option>
            <option value="unread">جديدة</option>
            <option value="read">مشاهدة</option>
          </select>
        </div>
        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
          :تصفية
        </span>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="bg-milkColor dark:bg-customDarkGreen rounded-lg shadow">
        <NotificationList
          notifications={filteredNotifications}
          loading={isLoading}
          onMarkAsRead={markAsRead}
        />
      </div>
    </div>
  );
}

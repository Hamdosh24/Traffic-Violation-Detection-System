"use client";
import { useState, useEffect } from "react";
import NotificationList from "@/components/backoffice/NotificationList";
import { BellRingIcon } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "read") return notification.isRead;
    if (filter === "unread") return !notification.isRead;
    return true;
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // التحقق من وجود بيانات مخزنة محلياً
        const cachedNotifications = localStorage.getItem("cachedNotifications");
        const cacheTime = localStorage.getItem("notificationsCacheTime");

        if (
          cachedNotifications &&
          cacheTime &&
          Date.now() - parseInt(cacheTime) < 5 * 60 * 1000
        ) {
          setNotifications(JSON.parse(cachedNotifications));
          setLoading(false);
          return;
        }

        const response = await fetch("/api/notifications");
        const data = await response.json();
        setNotifications(data);

        localStorage.setItem("cachedNotifications", JSON.stringify(data));
        localStorage.setItem("notificationsCacheTime", Date.now().toString());
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);

      const updatedCache = [
        newNotification,
        ...JSON.parse(localStorage.getItem("cachedNotifications") || "[]"),
      ];
      localStorage.setItem("cachedNotifications", JSON.stringify(updatedCache));
    };

    return () => eventSource.close();
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));

      const updatedCache = notifications.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem("cachedNotifications", JSON.stringify(updatedCache));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const markAsRead = async (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header Section */}
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
            disabled={unreadCount === 0}
          >
            تعيين الكل كمقروء
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex items-center mb-4 gap-2">
          <div className="relative inline-block">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none p-2 pr-8 text-sm border rounded bg-white font-bold dark:bg-customDarkGreen focus:outline-none focus:ring-2 focus:ring-customGreen"
            >
              <option value="all">الكل</option>
              <option value="unread">غير المقروءة</option>
              <option value="read">المقروءة</option>
            </select>
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
            :تصفية
          </span>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-customDarkGreen rounded-lg shadow">
          <NotificationList
            notifications={filteredNotifications}
            loading={loading}
            onMarkAsRead={markAsRead}
          />
        </div>
      </div>
    </div>
  );
}

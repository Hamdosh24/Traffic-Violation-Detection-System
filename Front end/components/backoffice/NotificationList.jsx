"use client";
import Link from "next/link";
import NotificationCard from "./NotificationCard";

export default function NotificationList({
  notifications,
  loading,
  onMarkAsRead,
}) {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customGreen mx-auto"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        لا توجد إشعارات جديدة
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {notifications.map((notification) => (
        <li
          key={notification.id}
          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Link
            href={`/notifications/${notification.id}`}
            onClick={() =>
              !notification.isRead && onMarkAsRead(notification.id)
            }
            className="block"
            scroll={false}
          >
            <NotificationCard notification={notification} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

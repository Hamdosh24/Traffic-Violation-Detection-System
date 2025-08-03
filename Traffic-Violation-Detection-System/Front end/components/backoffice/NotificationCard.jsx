"use client";
import { CheckCheckIcon, Clock1Icon } from "lucide-react";

export default function NotificationCard({ notification }) {
  return (
    <div
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        !notification.isRead ? "bg-blue-50 dark:bg-blue-900/30" : ""
      }`}
    >
      <div className="flex items-start">
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              !notification.isRead
                ? "text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {notification.title}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {notification.message}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {new Date(notification.date).toLocaleString("ar-EG", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="ml-4">
          {notification.isRead ? (
            <CheckCheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <Clock1Icon className="h-5 w-5 text-yellow-500" />
          )}
        </div>
      </div>
    </div>
  );
}

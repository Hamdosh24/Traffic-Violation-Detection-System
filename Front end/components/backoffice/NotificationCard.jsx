"use client";
import { useState } from "react";
import { AlertTriangle, MapPin, Clock, Eye, CheckCheck } from "lucide-react";

export default function NotificationCard({ notification, onMarkAsRead }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkAsRead = async (e) => {
    e.stopPropagation();
    if (notification.isRead) return;

    setIsUpdating(true);
    try {
      await onMarkAsRead(notification.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDate = new Date(notification.date).toLocaleString("ar-EG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      dir="rtl"
      className={`relative group overflow-hidden rounded-xl shadow-sm transition-all duration-200 hover:shadow-md ${
        !notification.isRead
          ? "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10"
          : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
      }`}
    >
      {/* شريط الحالة الجانبي */}
      <div
        className={`absolute right-0 top-0 h-full w-1 ${
          !notification.isRead ? "bg-red-500" : "bg-gray-300 dark:bg-gray-600"
        }`}
      ></div>

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* أيقونة الحالة */}
          <div
            className={`p-2 rounded-lg flex-shrink-0 ${
              !notification.isRead
                ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            <AlertTriangle size={20} />
          </div>

          {/* محتوى البطاقة */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3
                  className={`font-medium ${
                    !notification.isRead
                      ? "text-red-700 dark:text-red-300"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {notification.message}
                </p>
              </div>

              <button
                onClick={handleMarkAsRead}
                disabled={isUpdating || notification.isRead}
                className={`p-1.5 rounded-full transition-colors ${
                  !notification.isRead
                    ? "text-red-600 hover:bg-red-100/50 dark:text-red-400 dark:hover:bg-red-900/20"
                    : "text-gray-400 cursor-default"
                }`}
                aria-label={
                  notification.isRead ? "تمت المشاهدة" : "تعليم كمقروء"
                }
              >
                {isUpdating ? (
                  <Clock size={18} className="animate-spin" />
                ) : notification.isRead ? (
                  <CheckCheck className="text-customGreen" size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* معلومات الموقع */}
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center text-xs bg-white/80 dark:bg-gray-700/80 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                <MapPin size={12} className="ml-1 text-red-500" />
                {notification.camera.region || "موقع غير معروف"}
              </span>
              <span className="inline-flex items-center text-xs bg-white/80 dark:bg-gray-700/80 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                الكاميرا #{notification.camera.id}
              </span>
            </div>

            {/* التاريخ والحالة */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Clock size={12} className="ml-1" />
                {formattedDate}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  !notification.isRead
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {!notification.isRead ? "جديد" : "قديم"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import {
  CheckCircle,
  Clock,
  MapPin,
  AlertTriangle,
  Camera,
} from "lucide-react";

export default function NotificationCard({ notification, onMarkAsRead }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkAsRead = async (e) => {
    e.stopPropagation();
    if (notification.isRead) return;

    setIsUpdating(true);
    try {
      await onMarkAsRead(notification.id);
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formattedDate = new Date(notification.date).toLocaleString("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`relative p-5 mb-4 rounded-xl transition-all duration-300 ${
        !notification.isRead
          ? "bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-l-4 border-red-500"
          : "bg-white dark:bg-gray-800 border-l-4 border-gray-200 dark:border-gray-600"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-full flex-shrink-0 ${
            !notification.isRead
              ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          }`}
        >
          <AlertTriangle size={24} />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3
                className={`text-xl font-bold ${
                  !notification.isRead
                    ? "text-red-700 dark:text-red-300"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {notification.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {notification.message}
              </p>
            </div>

            <button
              onClick={handleMarkAsRead}
              disabled={isUpdating}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                !notification.isRead
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              {isUpdating
                ? "جاري التحديث..."
                : !notification.isRead
                ? "تمت المشاهدة"
                : "تمت المراجعة"}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center">
                <Camera className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    رقم الكاميرا
                  </p>
                  <p className="font-medium">{notification.camera.id}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    المحافظة
                  </p>
                  <p className="font-medium">
                    {notification.camera.governorate}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    المنطقة
                  </p>
                  <p className="font-medium">{notification.camera.region}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    الشارع
                  </p>
                  <p className="font-medium">{notification.camera.street}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              {notification.isRead ? (
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>تمت المراجعة</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>جديد</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

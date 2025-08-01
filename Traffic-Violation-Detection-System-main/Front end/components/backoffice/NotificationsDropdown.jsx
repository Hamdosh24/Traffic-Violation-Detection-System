"use client";
import { BellRingIcon } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationList from "@/components/backoffice/NotificationList";

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // بيانات وهمية للإشعارات (يمكن استبدالها بطلب API)
  useEffect(() => {
    const mockNotifications = [
      {
        id: "1",
        title: "طلب جديد",
        message: "تم استلام طلب جديد من العميل أحمد محمد",
        date: new Date().toISOString(),
        isRead: false,
      },
      {
        id: "2",
        title: "تحديث النظام",
        message: "تم تحديث النظام إلى النسخة 2.5.0",
        date: "2023-11-14T09:15:00Z",
        isRead: true,
      },
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative focus:outline-none">
        <BellRingIcon className="h-6 w-6 text-customGreen mx-2 hover:dark:text-white cursor-pointer" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white dark:bg-customDarkGreen w-80 p-0 max-h-[400px] overflow-y-auto"
        align="end"
      >
        <div className="p-2 border-b dark:border-gray-700">
          <h3 className="font-bold text-lg">الإشعارات</h3>
        </div>
        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkAsRead={markAsRead}
          compactMode={true}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

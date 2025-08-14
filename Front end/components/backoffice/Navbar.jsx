"use client";
import { AlignJustify, BellRingIcon, LogOut, UserRound } from "lucide-react";
import React, { useEffect, useState } from "react";
import ThemeSwitcherBtn from "@/components/backoffice/ThemeSwitcherBtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { StandardApi } from "@/app/api/StandarApi";
import Link from "next/link";
import useNotificationStore from "@/stores/notificationStore";

export default function Navbar({ setShowSidebar, showSidebar }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { unreadCount, cleanupSSE } = useNotificationStore();

  useEffect(() => {
    return () => cleanupSSE();
  }, [cleanupSSE]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { success } = await StandardApi.logout();
      if (success) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        router.push("/");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-milkColor dark:bg-customDarkGreenbg shadow-md z-[100] flex items-center justify-center px-8">
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="absolute left-6 focus:outline-none"
        aria-label="Toggle sidebar"
      >
        <AlignJustify className="text-customGreen dark:hover:text-milkColor w-6 h-6" />
      </button>

      <div className="flex-shrink-0 z-[101]">
        <Link href="/employeeDashboard">
          <Image
            src="/Logo1.png"
            alt="Logo"
            width={75}
            height={100}
            className="object-contain"
            quality={100}
          />
        </Link>
      </div>

      <div className="absolute right-6 flex items-center space-x-4">
        <ThemeSwitcherBtn />

        <div className="relative">
          <Link href="/employeeDashboard/notifications">
            <BellRingIcon className="h-6 w-6 text-customGreen mx-2 hover:dark:text-white cursor-pointer" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none flex items-center">
            <button
              className="flex items-center justify-center"
              aria-label="User menu"
            >
              <UserRound className="stroke-customGreen dark:hover:stroke-milkColor w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-milkColor dark:bg-customDarkGreen rounded-md min-w-[180px]">
            <DropdownMenuItem
              className="hover:dark:bg-slate-700 hover:bg-slate-200"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <div className="flex items-center px-4 py-2">
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// components/backoffice/Navbar.js
"use client";
import { AlignJustify, BellRingIcon, LogOut, UserRound } from "lucide-react";
import React, { useState } from "react";
import ThemeSwitcherBtn from "@/components/backoffice/ThemeSwitcherBtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StandardApi } from "@/app/api/StandarApi";
import { useSSE } from "@/context/SSEContext";

// أضيفي role كـ prop هنا ↓
export default function Navbar({ setShowSidebar, showSidebar, role }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { disconnectSSE, unviewedCount } = useSSE();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      disconnectSSE();
      const { success } = await StandardApi.logout();
      if (success) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
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
            src="/Gold.png"
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

        {/* عرض جرس الإشعارات فقط إذا كان المستخدم Employee */}
        {role === "Employee" && (
          <div className="relative">
            <Link href="/employeeDashboard/notifications">
              <div className="relative p-1">
                <BellRingIcon className="h-6 w-6 text-customGreen mx-2 hover:dark:text-white cursor-pointer" />
                {unviewedCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {unviewedCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none flex items-center">
            <button
              className="flex items-center justify-center"
              aria-label="User menu"
            >
              <UserRound className="stroke-customGreen dark:hover:stroke-milkColor w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-milkColor dark:bg-customDarkGreen rounded-md min-w-[180px]"
            align="end"
          >
            <DropdownMenuItem
              className="hover:dark:bg-slate-700 hover:bg-slate-200 cursor-pointer"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <div className="flex items-center px-4 py-2 w-full">
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

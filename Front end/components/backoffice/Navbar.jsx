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
import { StandardApi } from "@/app/api/StandarApi";

export default function Navbar({ setShowSidebar, showSidebar }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { success, error } = await StandardApi.logout();

      if (success) {
        localStorage.removeItem("token");
        console.log("token was deleted from NavBar");
        localStorage.removeItem("userData");
        router.push("/");
      } else {
        console.error("Logout error:", error);
        alert(`فشل تسجيل الخروج: ${error}`);
      }
    } catch (err) {
      console.error("Logout failed:", err);
      alert("حدث خطأ غير متوقع أثناء تسجيل الخروج");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-milkColor dark:bg-customDarkGreenbg shadow-md z-[100] flex items-center justify-center px-8">
      {/* زر الهامبرغر - يسار */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="absolute left-6 focus:outline-none"
        aria-label="Toggle sidebar"
      >
        <AlignJustify className="text-customGreen dark:hover:text-milkColor w-6 h-6" />
      </button>

      {/* الشعار في المنتصف */}
      <div className="flex-shrink-0 z-[101]">
        {" "}
        {/* زيادة z-index للشعار */}
        <Image
          src="/Logo1.png"
          alt="Logo"
          width={75}
          height={100}
          className="object-contain"
          quality={100}
        />
      </div>

      {/* أيقونات اليمين */}
      <div className="absolute right-6 flex items-center space-x-4">
        <ThemeSwitcherBtn />
        <BellRingIcon className="h-6 w-6 text-customGreen mx-2 hover:dark:text-white cursor-pointer" />

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none flex items-center">
            <button
              className="flex items-center justify-center"
              aria-label="User profile menu"
              disabled={isLoggingOut}
            >
              <UserRound className="stroke-customGreen dark:hover:stroke-milkColor w-6 h-6" />
            </button>
          </DropdownMenuTrigger>

          {/* تعديلات القائمة المنسدلة */}
          <DropdownMenuContent
            className="bg-milkColor text-black hover:bg-milkColor/90 dark:bg-customDarkGreen dark:text-slate-100 dark:border-slate-700 rounded-md w-full min-w-[180px] absolute right-0 mt-2 z-[110]"
            sideOffset={10}
            align="end"
          >
            <DropdownMenuItem
              className="hover:dark:bg-slate-700 hover:bg-slate-200 w-full"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <div className="flex items-center space-x-2 w-full cursor-pointer px-4 py-2">
                <LogOut className="mr-2 h-4 w-4" />
                <span>
                  {isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

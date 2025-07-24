import { AlignJustify, LogOut, UserRound } from "lucide-react";
import React from "react";
import ThemeSwitcherBtn from "@/components/backoffice/ThemeSwitcherBtn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";

export default function Navbar({ setShowSidebar, showSidebar }) {
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
      <div className="flex-shrink-0">
        <Image
          src="/Logo1.png"
          alt="Logo"
          width={75}
          height={100}
          className="object-contain"
          quality={100}
        />
      </div>

      {/* أيقونات اليمين: تبديل الثيم + البروفايل */}
      <div className="absolute right-6 flex items-center space-x-4">
        <ThemeSwitcherBtn />
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none flex items-center">
            <button
              className="flex items-center justify-center"
              aria-label="User profile menu"
            >
              <UserRound className="stroke-customGreen dark:hover:stroke-milkColor w-6 h-6" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-milkColor text-black hover:bg-milkColor/90 dark:bg-customDarkGreen dark:text-slate-100 dark:border-slate-700 rounded-md w-fit mr-14">
            <DropdownMenuItem className="hover:dark:bg-slate-700 hover:bg-slate-200 w-full">
              <Link
                href={"/"}
                className="flex items-center space-x-2 pr-10 w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

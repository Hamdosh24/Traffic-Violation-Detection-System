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

export default function Navbar({ setShowSidebar, showSidebar }) {
  return (
    <div className="flex items-center justify-between shadow-md bg-white dark:bg-slate-800 text-slate-50 h-16 py-8 fixed top-0 px-8 z-50 w-full sm:pr-[20rem]">
      <Link href={"/dashboard"} className="sm:hidden">
        Limi
      </Link>
      {/* {Icon} */}
      <button onClick={() => setShowSidebar(!showSidebar)}>
        {/* list  */}
        <AlignJustify className="text-customGreen" />
      </button>
      {/* 3 Icon */}
      <div className="flex items-center space-x-4">
        {/* theme */}
        <div className="flex items-center justify-center">
          <ThemeSwitcherBtn className="text-customGreen" />
        </div>

        {/* profile */}
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex items-center">
              <button className="flex items-center justify-center">
                <UserRound className="stroke-customGreen w-6 h-6" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-slate-50 text-black dark:bg-gray-800 dark:text-slate-100 dark:border-slate-700 rounded-md w-fit mr-14">
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
    </div>
  );
}

import {
  AlignJustify,
  Bell,
  LayoutDashboard,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import ThemeSwitcherBtn from "@/components/backoffice/ThemeSwitcherBtn";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  DropdownMenuSeparator,
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
      <div className="flex space-x-3">
        {/* theme  */}
        <ThemeSwitcherBtn className="text-customGreen" />

        {/* notification  */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <button
              type="button"
              className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-transparent rounded-lg"
            >
              <Bell className="text-customGreen" />
              <span className="sr-only">Notifications</span>
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-1 border-white rounded-full -top-0 end-6 dark:border-gray-900">
                3
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="m-1 bg-slate-50 text-black dark:bg-gray-800 dark:text-slate-100 mr-28 w-100 dark:border-slate-700 rounded-md">
            {/* <DropdownMenuLabel>Notifications</DropdownMenuLabel> */}

            {/* <DropdownMenuSeparator className="dark:bg-slate-700 bg-slate-400" /> */}

            <DropdownMenuItem>
              <div className="flex items-center space-x-5">
                <Image
                  src="/Profile.jpg"
                  alt="User profile"
                  width={200}
                  height={200}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col space-y-1">
                  <p>Yellow Sweet Corn Stock out,</p>
                  <div className="flex items-center space-x-2">
                    <p className="px-3 py-0.5 bg-red-700 text-white rounded-full text-sm">
                      Stock Out
                    </p>
                    <p>Dec 12 2021 - 12:40PM</p>
                  </div>
                </div>
                <button className="hover:dark:bg-slate-700 hover:bg-slate-200 rounded-full p-1">
                  <X />
                </button>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="dark:bg-slate-700 bg-slate-200" />

            <DropdownMenuItem>
              <div className="flex items-center space-x-5">
                <Image
                  src="/Profile.jpg"
                  alt="User profile"
                  width={200}
                  height={200}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col space-y-1">
                  <p>Yellow Sweet Corn Stock out,</p>
                  <div className="flex items-center space-x-2">
                    <p className="px-3 py-0.5 bg-red-700 text-white rounded-full text-sm">
                      Stock Out
                    </p>
                    <p>Dec 12 2021 - 12:40PM</p>
                  </div>
                </div>
                <button className="hover:dark:bg-slate-700 hover:bg-slate-200 rounded-full p-1">
                  <X />
                </button>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="dark:bg-slate-700 bg-slate-200" />

            <DropdownMenuItem>
              <div className="flex items-center space-x-5">
                <Image
                  src="/Profile.jpg"
                  alt="User profile"
                  width={200}
                  height={200}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col space-y-1">
                  <p>Yellow Sweet Corn Stock out,</p>
                  <div className="flex items-center space-x-2">
                    <p className="px-3 py-0.5 bg-red-700 text-white rounded-full text-sm">
                      Stock Out
                    </p>
                    <p>Dec 12 2021 - 12:40PM</p>
                  </div>
                </div>
                <button className="hover:dark:bg-slate-700 hover:bg-slate-200 rounded-full p-1">
                  <X />
                </button>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* profile  */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <button>
              <Image
                alt="Profile"
                src="/Profile.jpg"
                width={200}
                height={200}
                className="w-8 h-8 rounded-full"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-slate-50 text-black dark:bg-gray-800 dark:text-slate-100 dark:border-slate-700 rounded-md w-fit mr-14">
            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-slate-600" /> */}
            <DropdownMenuItem className="hover:dark:bg-slate-700 hover:bg-slate-200 w-full">
              <button className="flex items-center space-x-2 pr-10">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:dark:bg-slate-700 hover:bg-slate-200 w-full">
              <button className="flex items-center space-x-2 pr-10">
                <Settings className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:dark:bg-slate-700 hover:bg-slate-200 w-full">
              <button className="flex items-center space-x-2 pr-10">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

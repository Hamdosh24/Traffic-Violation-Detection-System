"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../public/Logo.svg";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  LogOut,
  ChartColumn,
  User2,
  History,
  LockOpen,
} from "lucide-react";

export default function Sidebar({ type, showSidebar, setShowSidebar }) {
  const pathname = usePathname();

  console.log(pathname);

  // this is the main button in the SideBar

  const employeeSidebarLinks = [
    {
      title: "Statistic",
      icon: ChartColumn,
      href: "/employeeDashboard/statistic",
    },
    {
      title: "Accounts",
      icon: User2,
      href: "/employeeDashboard/accounts",
    },
    {
      title: "Activity Log",
      icon: History,
      href: "/employeeDashboard/activityLog",
    },
    {
      title: "Change Passowrd",
      icon: LockOpen,
      href: "/employeeDashboard/changepassowrd",
    },
  ];

  const sidebarLinks = [
    {
      title: "Statistic",
      icon: ChartColumn,
      href: "/adminDashboard/statistic",
    },
    {
      title: "Accounts",
      icon: User2,
      href: "/adminDashboard/accounts",
    },
    {
      title: "Activity Log",
      icon: History,
      href: "/adminDashboard/activityLog",
    },
    {
      title: "Change Passowrd",
      icon: LockOpen,
      href: "/adminDashboard/changepassowrd",
    },
  ];
  return (
    <div
      className={
        showSidebar
          ? "z-50 fixed sm:block mt-16 sm:mt-0 dark:bg-slate-800 bg-white space-y-6 w-64 h-screen dark:text-slate-100 left-0 top-0 shadow-md flex flex-col"
          : "z-50 fixed hidden sm:block mt-16 sm:mt-0 dark:bg-slate-800 bg-white space-y-6 w-64 h-screen dark:text-slate-100 left-0 top-0 shadow-md flex-col"
      }
    >
      <div className="px-6 py-4 ">
        <Link
          onClick={() => setShowSidebar(false)}
          href={type === "employee" ? "/employeeDashboard" : "/adminDashboard"}
        >
          <Image src={logo} alt="limifood logo" className="w-28 text-black" />
        </Link>
      </div>
      <div className="text-gray-400  space-y-3 flex flex-col">
        <Link
          onClick={() => setShowSidebar(false)}
          href={type === "employee" ? "/employeeDashboard" : "/adminDashboard"}
          className={
            pathname ===
            (type === "employee" ? "/employeeDashboard" : "/adminDashboard")
              ? "flex items-center space-x-1 px-6 py-2.5 border-l-4 border-customGreen text-customGreen"
              : "flex items-center hover:text-customGreen dark:hover:text-gray-200 space-x-1 px-6 py-2.5"
          }
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="pl-4 font-bold">Dashboard</span>
        </Link>

        {""}
        {type == "employee"
          ? employeeSidebarLinks.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={() => setShowSidebar(false)}
                  key={i}
                  href={item.href}
                  className={
                    item.href == pathname
                      ? "flex items-center space-x-1 px-6 py-2.5 border-l-4 border-customGreen text-customGreen"
                      : "flex items-center text-slate-400 hover:text-customGreen dark:hover:text-gray-200 space-x-1 px-6 py-2.5"
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="pl-4 font-bold text-sm">{item.title}</span>
                </Link>
              );
            })
          : sidebarLinks.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={() => setShowSidebar(false)}
                  key={i}
                  href={item.href}
                  className={
                    item.href == pathname
                      ? "flex items-center space-x-1 px-6 py-2.5 border-l-4 border-customGreen text-customGreen"
                      : "flex items-center text-slate-400 hover:text-customGreen dark:hover:text-gray-200 space-x-1 px-6 py-2.5"
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="pl-4 font-bold text-sm">{item.title}</span>
                </Link>
              );
            })}

        {/* "relative left-5 pt-20" */}
        <div className="m-auto py-4">
          <button className="bg-customGreen text-white font-medium flex items-center space-x-1 px-16 py-3 rounded-md text-sm hover:bg-emerald-700">
            <LogOut />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

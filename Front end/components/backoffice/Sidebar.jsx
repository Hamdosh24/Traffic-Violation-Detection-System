"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  LogOut,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  User2,
  History,
  ChartColumnIncreasing,
  BellRing,
  Camera,
  Car,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Sidebar({ type, showSidebar }) {
  const pathname = usePathname();

  console.log(pathname);

  // this is the main button in the SideBar
  const catalogueLinks = [
    {
      title: "مخطط مكاني",
      // icon: ChartColumnIncreasing,
      href:
        type === "employee"
          ? "/employeeDashboard/church"
          : "/adminDashboard/church",
    },
    {
      title: "مخطط زمني",
      // icon: ChartColumnIncreasing,
      href:
        type === "employee"
          ? "/employeeDashboard/spatial"
          : "/adminDashboard/spatial",
    },
  ];
  const employeeSidebarLinks = [
    {
      title: "الاشعارات",
      icon: BellRing,
      href: "/employeeDashboard/notifications",
    },
    {
      title: "الكاميرات",
      icon: Camera,
      href: "/employeeDashboard/cameras",
    },
    {
      title: "تعقب مرقبة",
      icon: Car,
      href: "/employeeDashboard/tracking",
    },
  ];

  const sidebarLinks = [
    {
      title: "الحسابات",
      icon: User2,
      href: "/adminDashboard/accounts",
    },
    {
      title: "سجل النشاط",
      icon: History,
      href: "/adminDashboard/activityLog",
    },
  ];
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-milkColor dark:bg-customDarkGreenbg shadow-md transition-transform duration-300  ease-in-out z-50 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Link
        // onClick={() => setShowSidebar(false)}
        href={type === "employee" ? "/employeeDashboard" : "/adminDashboard"}
      >
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/Logo1.png"
            alt="First text image"
            width={75}
            height={100}
            className="object-contain"
            quality={100}
          />
          <span className="pl-2 font-bold text-[#b7a579] ">
            كشف المخالفات المرورية
          </span>
        </div>
      </Link>
      <div className="text-gray-400 mt-5 space-y-3 flex flex-col">
        <Link
          // onClick={() => setShowSidebar(false)}
          href={type === "employee" ? "/employeeDashboard" : "/adminDashboard"}
          className={
            pathname ===
            (type === "employee" ? "/employeeDashboard" : "/adminDashboard")
              ? "flex items-center space-x-1 px-6 py-2.5 border-l-4 border-customGreen text-customGreen"
              : "flex items-center hover:text-customGreen dark:hover:text-gray-200 space-x-1 px-6 py-2.5"
          }
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="pl-4 font-bold">لوحة التحكم</span>
        </Link>

        {/* Statistics */}
        <Collapsible
          className={
            catalogueLinks.some((link) => link.href === pathname)
              ? "px-6  border-l-4 border-customGreen"
              : "px-6 "
          }
        >
          <CollapsibleTrigger onClick={() => setOpenMenu(!openMenu)}>
            <button className="flex items-center text-slate-400 space-x-4 hover:text-customGreen dark:hover:text-gray-200 ">
              <div className="flex items-center space-x-1">
                <ChartColumnIncreasing className="w-5 h-5" />
                <span className="pl-4 font-bold text-sm">الاحصائيات</span>
              </div>
              {openMenu ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="py-2 pl-5 dark:bg-customDarkGreen bg-white rounded-md text-sm dark:text-slate-500">
            {catalogueLinks.map((item, i) => {
              return (
                <Link
                  // onClick={() => setShowSidebar(false)}
                  key={i}
                  href={item.href}
                  className=" text-slate-400 flex items-center space-x-1 font-medium py-1"
                >
                  {/* <Minus className="w-3 h-3" /> */}
                  <div className="flex justify-center items-center hover:text-customGreen">
                    <span className="pl-2">{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
        {""}
        {type == "employee"
          ? employeeSidebarLinks.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  // onClick={() => setShowSidebar(false)}
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
                  // onClick={() => setShowSidebar(false)}
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
          <Link href={"/"}>
            <button className="bg-customGreen text-white justify-center flex items-center space-x-1 px-16 py-3 rounded-md text-sm hover:bg-emerald-700">
              <LogOut />
              <span className="font-bold">تسجيل الخروج</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

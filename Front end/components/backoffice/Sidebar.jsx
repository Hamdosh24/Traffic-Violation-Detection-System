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
import { useRouter } from "next/navigation";
import { StandardApi } from "@/app/api/StandarApi";

export default function Sidebar({ role, showSidebar }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { success, error } = await StandardApi.logout();

      if (success) {
        // مسح token وإعادة التوجيه
        localStorage.removeItem("token");
        console.log("token: was deleted");
        router.push("/"); // توجيه إلى صفحة تسجيل الدخول
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

  // روابط الإحصائيات (للموظفين فقط)
  const statisticsLinks =
    role === "Employee"
      ? [
          {
            title: "مخطط مكاني",
            href: "/employeeDashboard/church",
          },
          {
            title: "مخطط زمني",
            href: "/employeeDashboard/spatial",
          },
        ]
      : [];

  // روابط الموظف
  const employeeLinks = [
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
      title: "تعقب مركبة",
      icon: Car,
      href: "/employeeDashboard/tracking",
    },
  ];

  // روابط المدير
  const managerLinks = [
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

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-milkColor dark:bg-customDarkGreenbg shadow-md transition-transform duration-300 ease-in-out z-50 ${
        showSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Link
        href={role === "Manager" ? "/adminDashboard" : "/employeeDashboard"}
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
          <span className="pl-2 font-bold text-[#b7a579]">
            كشف المخالفات المرورية
          </span>
        </div>
      </Link>

      <div className="text-gray-400 mt-5 space-y-3 flex flex-col">
        {/* رابط لوحة التحكم */}
        <Link
          href={role === "Manager" ? "/adminDashboard" : "/employeeDashboard"}
          className={
            pathname ===
            (role === "Manager" ? "/adminDashboard" : "/employeeDashboard")
              ? "flex items-center space-x-1 px-6 py-2.5 border-l-4 border-customGreen text-customGreen"
              : "flex items-center hover:text-customGreen dark:hover:text-gray-200 space-x-1 px-6 py-2.5"
          }
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="pl-4 font-bold">لوحة التحكم</span>
        </Link>

        {/* قسم الإحصائيات */}
        {role === "Employee" && (
          <Collapsible
            className={
              statisticsLinks.some((link) => link.href === pathname)
                ? "px-6 border-l-4 border-customGreen"
                : "px-6"
            }
          >
            <CollapsibleTrigger onClick={() => setOpenMenu(!openMenu)}>
              <button className="flex items-center text-slate-400 space-x-4 hover:text-customGreen dark:hover:text-gray-200">
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
            <CollapsibleContent className="py-2 pl-5 mt-2 dark:bg-customDarkGreen bg-white rounded-md text-sm dark:text-slate-500">
              {statisticsLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="text-slate-400 flex items-center space-x-1 font-medium py-1 hover:text-customGreen"
                >
                  <div className="flex justify-center items-center">
                    <span className="pl-2">{item.title}</span>
                  </div>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* الروابط الخاصة بكل دور */}
        {(role === "Employee" ? employeeLinks : managerLinks).map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={i}
              href={item.href}
              className={
                item.href === pathname
                  ? "flex items-center space-x-1 px-6 py-2.5 border-l-4 border-customGreen text-customGreen"
                  : "flex items-center text-slate-400 hover:text-customGreen dark:hover:text-gray-200 space-x-1 px-6 py-2.5"
              }
            >
              <Icon className="w-5 h-5" />
              <span className="pl-4 font-bold text-sm">{item.title}</span>
            </Link>
          );
        })}

        {/* زر تسجيل الخروج */}
        <div className="m-auto py-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-customGreen text-white justify-center flex items-center space-x-1 px-16 py-3 rounded-md text-sm hover:bg-emerald-700 disabled:opacity-70"
          >
            {isLoggingOut ? (
              <span>جاري تسجيل الخروج...</span>
            ) : (
              <>
                <LogOut className="w-5 h-5" />
                <span className="font-bold">تسجيل الخروج</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

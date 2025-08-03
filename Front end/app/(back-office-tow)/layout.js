"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Sidebar from "@/components/backoffice/Sidebar";
import Navbar from "@/components/backoffice/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EmployeeLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // التحقق من وجود التوكن أولاً
    if (!token) {
      router.push("/");
      return;
    }

    // التحقق من بيانات المستخدم
    if (userData) {
      try {
        const { role } = JSON.parse(userData);

        // السماح فقط للموظفين بالدخول
        if (role === "Employee") {
          setIsEmployee(true);
        } else {
          // إذا كان ليس موظفاً، توجيهه للصفحة المناسبة لدوره
          router.push(role === "Manager" ? "/adminDashboard" : "/");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {isEmployee && (
        <Sidebar
          role="Employee"
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      )}

      <div
        className={`flex flex-col flex-grow transition-all duration-300 mt-16 ${
          showSidebar && isEmployee ? "ml-64" : "ml-0"
        }`}
      >
        <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className="p-8 text-slate-800 dark:text-slate-50 relative flex-grow">
          {/* خلفية بيضاء للثيم الفاتح */}
          {theme === "light" && (
            <div className="absolute inset-0 -z-10 bg-milkColor" />
          )}

          {/* صورة الخلفية للثيم الداكن */}
          {theme === "dark" && (
            <div className="absolute inset-0 -z-10">
              <Image
                src="/page.jpg"
                alt="Background"
                fill
                className="object-cover"
                quality={75}
                priority
              />
            </div>
          )}

          {isEmployee ? (
            children
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg">غير مصرح لك بالوصول إلى هذه الصفحة</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

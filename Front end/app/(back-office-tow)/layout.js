// app/(dashboard)/employeeDashboard/layout.js
"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Sidebar from "@/components/backoffice/Sidebar";
import Navbar from "@/components/backoffice/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
// احذفي هذا السطر ↓
// import { SSEProvider } from "@/context/SSEContext";

export default function EmployeeLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/");
      return;
    }

    if (userData) {
      try {
        const { role } = JSON.parse(userData);
        if (role === "Employee") {
          setIsEmployee(true);
        } else {
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
      {isEmployee ? (
        // احذفي الـ SSEProvider من هنا ↓
        <>
          <Sidebar
            role="Employee"
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
          />
          <div
            className={`flex flex-col flex-grow transition-all duration-300 mt-16 ${
              showSidebar ? "ml-64" : "ml-0"
            }`}
          >
            <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
            <main className="p-8 text-slate-800 dark:text-slate-50 relative flex-grow">
              {theme === "light" && (
                <div className="absolute inset-0 -z-10 bg-milkColor" />
              )}
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
              {children}
            </main>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <p className="text-lg">غير مصرح لك بالوصول إلى هذه الصفحة</p>
        </div>
      )}
    </div>
  );
}

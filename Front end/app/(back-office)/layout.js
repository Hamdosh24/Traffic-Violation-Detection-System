"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Sidebar from "@/components/backoffice/Sidebar";
import Navbar from "@/components/backoffice/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [userRole, setUserRole] = useState(null);
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
        setUserRole(role);
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
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {userRole && (
        <Sidebar
          role={userRole}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      )}

      <div
        className={`flex flex-col flex-grow transition-all duration-300 mt-16 ${
          showSidebar ? "ml-64" : "ml-0"
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
            // <div className="absolute inset-0 -z-10 bg-maxGreen" />
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
    </div>
  );
}

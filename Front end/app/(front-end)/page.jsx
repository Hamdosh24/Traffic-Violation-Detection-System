import React from "react";
import Login from "@/components/frontend/Login";
import Image from "next/image";

export default function page() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* NavBar - تم تعديله للشاشات الصغيرة */}
      <nav className="w-full py-3 px-4 sm:px-6 absolute top-0 left-0 right-0 z-20 flex justify-between items-center bg-white/90 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
        <div className="flex items-center">
          <Image
            src="/Logo1.png"
            alt="Logo"
            width={60}
            height={30}
            className="object-contain w-[60px] h-[30px] sm:w-[80px] sm:h-[40px]"
          />
        </div>
        <div>
          <span className="text-base sm:text-xl font-bold text-[#b7a579] drop-shadow-md">
            الجمهورية العربية السورية
          </span>
        </div>
      </nav>

      <div className="relative flex items-center justify-center flex-grow pt-16 sm:pt-0 pb-8">
        {/* Background - تم تعديله للشاشات الصغيرة */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/page.jpg"
            alt="Background"
            fill
            className="object-cover"
            quality={75}
            priority
          />
          <div className="absolute inset-0 sm:inset-20 bg-milkColor sm:rounded-lg"></div>
        </div>

        {/* Main Content - تحسينات للشاشات الصغيرة والمتوسطة */}
        <div
          className="container mx-auto px-4 z-10 flex flex-col lg:flex-row items-center justify-center gap-6 w-full"
          dir="rtl"
        >
          {/* Logo Section - تحسينات للشاشات الصغيرة */}
          <div className="lg:ml-24 pb-6 sm:pb-28 flex flex-col justify-center items-center lg:items-end">
            <div className="w-[180px] h-[90px] sm:w-[240px] sm:h-[120px] lg:w-[300px] lg:h-[150px] relative">
              <Image
                src="/Logo1.png"
                alt="Traffic Violation Logo"
                fill
                className="object-contain"
                quality={100}
              />
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#b7a579] mt-3 sm:mt-4 text-center lg:text-right px-2 sm:px-0">
              نظام كشف المخالفات المرورية
            </span>
          </div>

          {/* Login Form - تحسينات للشاشات الصغيرة */}
          <div className="lg:mr-24 w-full max-w-md px-2 sm:px-0">
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
}

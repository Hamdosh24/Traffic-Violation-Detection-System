import React from "react";
import Login from "@/components/frontend/Login";
import Image from "next/image";

export default function page() {
  return (
    <div className="relative flex flex-col min-h-screen">
      {/* NavBar */}
      <nav className="w-full pb-4 px-6 absolute top-0 left-0 right-0 z-20 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/Logo1.png"
            alt="Logo"
            width={80}
            height={40}
            className="object-contain"
          />
        </div>
        <div>
          <span className="text-xl font-bold text-[#b7a579] drop-shadow-md">
            SYRIAN ARAB REPUBLIC
          </span>
        </div>
      </nav>

      <div className="relative flex items-center justify-center flex-grow">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/page.jpg"
            alt="Background"
            fill
            className="object-cover"
            quality={75}
            priority
          />
          <div className="absolute inset-20 bg-milkColor rounded-lg"></div>
        </div>
        {/* the main content */}
        <div className="container mx-auto px-4 z-10 flex flex-col lg:flex-row justify-center items-center gap-8">
          <div className="mr-24 pb-28 flex flex-col justify-center items-center lg:items-end">
            <Image
              src="/Logo1.png"
              alt="Traffic Violation Logo"
              width={300}
              height={150}
              className="relative object-contain"
              quality={100}
            />
            <span className="text-3xl font-bold text-[#b7a579] mt-4">
              Traffic Violation Detect
            </span>
          </div>

          <div className="ml-24 w-full max-w-md">
            <Login />
          </div>
        </div>
      </div>
    </div>
  );
}

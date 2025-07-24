"use client";
import Link from "next/link";
import React from "react";

export default function CameraCard({ data }) {
  return (
    <div className="max-w-4xl mx-auto mt-5 shadow-lg rounded-lg flex justify-between items-center bg-white/50 dark:bg-customDarkGreen">
      <div className="p-4">
        <Link href={`/employeeDashboard/cameras/${data.id}`}>
          <button className="p-2 rounded-xl text-sm font-bold text-white bg-customGreen hover:bg-emerald-700 dark:bg-checkGreen hover:-translate-y-1 transition-all hover:text-white">
            تفاصيل
          </button>
        </Link>
      </div>
      <div className="p-4 flex flex-col items-end">
        <div className="text-black dark:text-white">{data.id}</div>
        <div className="font-bold text-black dark:text-white">
          {data.address}
        </div>
        <div className="font-medium text-gray-400 items-end">
          {new Date(data.time).toLocaleString("ar-EG")}
        </div>
      </div>
    </div>
  );
}

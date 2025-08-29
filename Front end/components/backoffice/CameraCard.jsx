"use client";
import Link from "next/link";
import React from "react";

const CameraCard = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto mt-5 shadow-lg rounded-lg flex justify-between items-center bg-white/50 dark:bg-customDarkGreen p-4 hover:shadow-md transition-all">
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900">
            <span className="font-medium text-blue-800 dark:text-blue-300">
              {data.camera_id}
            </span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {data.region}
          </p>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {data.governorate}
          </p>
        </div>
      </div>

      <Link href={`/employeeDashboard/cameras/${data.camera_id}`}>
        <button className="p-2 rounded-xl text-sm font-bold text-white bg-customGreen hover:bg-emerald-700 dark:bg-checkGreen hover:-translate-y-1 transition-all">
          تفاصيل
        </button>
      </Link>
    </div>
  );
};

export default React.memo(CameraCard);

"use client";
import React from "react";
import Link from "next/link";

const cameraDetails = {
  "IG1-452": {
    id: "IG1-452",
    address: "تقاطع الملك فهد مع الجامعة - الرياض",
    region: "منطقة الرياض",
    installationDate: "2022-05-15",
    status: "نشطة",
    resolution: "4K",
    streamUrl: "rtsp://example.com/stream1",
    lastMaintenance: "2023-10-01",
  },
};

export default function CameraDetailsPage({ params }) {
  const camera = cameraDetails[params.cameraId];

  if (!camera) {
    return <div className="text-center py-10">الكاميرا غير موجودة</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-row justify-between mb-6">
        <div className="flex items-end">
          <Link
            href="/employeeDashboard/cameras"
            className="text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            العودة إلى القائمة
          </Link>
        </div>
        <div className="flex items-start">
          <h1 className="text-2xl font-bold mt-4 items-end text-gray-800 dark:text-white">
            {camera.id} :معرف الكاميرا
          </h1>
        </div>
      </div>

      {/* قسم البث المباشر - يأخذ العرض بالكامل */}
      <div className="bg-white flex flex-col items-end dark:bg-customDarkGreenbg rounded-lg p-4 mb-8">
        <h2 className="text-xl items-end font-semibold mb-4 text-gray-800 dark:text-white">
          البث المباشر
        </h2>
        <div className="aspect-video w-full bg-black rounded-md overflow-hidden">
          <video
            controls
            className="w-full h-full object-contain"
            src={camera.streamUrl}
            autoPlay
            muted
          >
            متصفحك لا يدعم تشغيل الفيديو
          </video>
        </div>
      </div>

      {/* قسم المعلومات - يأخذ العرض بالكامل تحت الفيديو */}
      <div className="bg-white dark:bg-customDarkGreenbg shadow-md dark:bg-cu rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
          معلومات الكاميرا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailCard label="المعرف" value={camera.id} />
          <DetailCard label="الموقع" value={camera.address} />
          <DetailCard label="المحافظة" value={camera.region} />
          <DetailCard label="حالة الكاميرا" value={camera.status} />
          <DetailCard label="دقة التصوير" value={camera.resolution} />
          <DetailCard
            label="تاريخ التركيب"
            value={new Date(camera.installationDate).toLocaleDateString(
              "ar-EG",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          />
          <DetailCard
            label="آخر صيانة"
            value={new Date(camera.lastMaintenance).toLocaleDateString(
              "ar-EG",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          />
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="bg-milkColor dark:bg-customDarkGreen p-4 items-end flex flex-col rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
        {label}
      </h3>
      <p className="text-lg font-semibold text-gray-800 dark:text-white break-words">
        {value}
      </p>
    </div>
  );
}

"use client";
import React from "react";
import { useRouter } from "next/navigation";

// بيانات الكاميرات (يمكن استبدالها بطلب API)

const cameraDetails = {
  "IG1-452": {
    id: "IG1-452",
    address: "تقاطع الملك فهد مع الجامعة - الرياض",
    time: "2023-11-15T14:30:00Z",
    region: "الرياض",
    status: "نشطة",
    resolution: "1080p",
    streamUrl: "rtsp://example.com/stream1",
  },
  "IG2-453": {
    id: "IG2-453",
    address: "شارع التحلية - جدة",
    time: "2023-11-15T15:00:00Z",
    region: "جدة",
    status: "نشطة",
    resolution: "720p",
    streamUrl: "rtsp://example.com/stream2",
  },
  "IG3-454": {
    id: "IG3-454",
    address: "دوار العليا - الرياض",
    time: "2023-11-15T14:45:00Z",
    region: "الرياض",
    status: "غير نشطة",
    resolution: "1080p",
    streamUrl: "rtsp://example.com/stream3",
  },
  "IG4-455": {
    id: "IG4-455",
    address: "شارع الأمير سلطان - مكة",
    time: "2023-11-15T13:30:00Z",
    region: "مكة",
    status: "نشطة",
    resolution: "4K",
    streamUrl: "rtsp://example.com/stream4",
  },
  "IG5-456": {
    id: "IG5-456",
    address: "شارع الأمير محمد بن عبدالعزيز - المدينة",
    time: "2023-11-15T14:00:00Z",
    region: "المدينة",
    status: "نشطة",
    resolution: "1080p",
    streamUrl: "rtsp://example.com/stream5",
  },
  "IG6-457": {
    id: "IG6-457",
    address: "شارع التحلية - جدة",
    time: "2023-11-15T15:30:00Z",
    region: "جدة",
    status: "صيانة",
    resolution: "720p",
    streamUrl: "rtsp://example.com/stream6",
  },
  "IG7-458": {
    id: "IG7-458",
    address: "دوار العليا - الرياض",
    time: "2023-11-15T14:15:00Z",
    region: "الرياض",
    status: "نشطة",
    resolution: "1080p",
    streamUrl: "rtsp://example.com/stream7",
  },
  "IG8-459": {
    id: "IG8-459",
    address: "شارع الستين - الأحساء",
    time: "2023-11-15T13:45:00Z",
    region: "الأحساء",
    status: "غير نشطة",
    resolution: "720p",
    streamUrl: "rtsp://example.com/stream8",
  },
  "IG9-460": {
    id: "IG9-460",
    address: "شارع الملك عبدالله - الدمام",
    time: "2023-11-15T15:15:00Z",
    region: "الدمام",
    status: "نشطة",
    resolution: "1080p",
    streamUrl: "rtsp://example.com/stream9",
  },
  "IG10-461": {
    id: "IG10-461",
    address: "محطة القطار - الرياض",
    time: "2023-11-15T14:50:00Z",
    region: "الرياض",
    status: "نشطة",
    resolution: "4K",
    streamUrl: "rtsp://example.com/stream10",
  },
};

export default function CameraDetailsPage({ params }) {
  const router = useRouter();
  const cameraId = decodeURIComponent(params.cameraId);
  const camera = cameraDetails[cameraId];

  if (!camera) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center py-10 text-2xl text-red-500">
          الكاميرا غير موجودة
        </div>
        <button
          onClick={() => router.push("/employeeDashboard/cameras")}
          className="px-4 py-2 bg-customGreen text-white rounded hover:bg-customGreen/80"
        >
          العودة إلى القائمة
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <button
          onClick={() => router.push("/employeeDashboard/cameras")}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
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
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          تفاصيل الكاميرا: {camera.id}
        </h1>
      </div>

      {/* Live Stream Section */}
      <div className="bg-white dark:bg-customDarkGreen rounded-lg p-6 mb-8 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-right">
          البث المباشر
        </h2>
        <div className="aspect-video w-full bg-black rounded-md overflow-hidden">
          {camera.streamUrl ? (
            <video
              controls
              className="w-full h-full object-contain"
              src={camera.streamUrl}
              autoPlay
              muted
            >
              متصفحك لا يدعم تشغيل الفيديو
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              لا يتوفر بث مباشر
            </div>
          )}
        </div>
      </div>

      {/* Camera Info Section */}
      <div className="bg-white dark:bg-customDarkGreen rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white text-right">
          معلومات الكاميرا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailCard label="المعرف" value={camera.id} />
          <DetailCard label="الموقع" value={camera.address} />
          <DetailCard label="المنطقة" value={camera.region} />
          <DetailCard label="الحالة" value={camera.status} />
          <DetailCard label="دقة التصوير" value={camera.resolution} />
          <DetailCard
            label="تاريخ التركيب"
            value={new Date(camera.time).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm text-right">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
        {label}
      </h3>
      <p className="text-lg font-semibold text-gray-800 dark:text-white break-words">
        {value || "غير متوفر"}
      </p>
    </div>
  );
}

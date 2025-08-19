"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StandardApi } from "@/app/api/StandarApi";
import Hls from "hls.js";

export default function CameraDetailsPage({ params }) {
  const router = useRouter();
  const cameraId = decodeURIComponent(params.cameraId);
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCameraDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await StandardApi.fetchCameraById(cameraId);
        console.log("API Response:", response);

        if (!response.success) {
          throw new Error(response.error);
        }

        if (!response.data || !response.data.camera_id) {
          throw new Error("بيانات الكاميرا غير مكتملة");
        }

        setCamera(response.data);
      } catch (err) {
        console.error("Error fetching camera details:", err);
        setError(err.message || "حدث خطأ أثناء جلب بيانات الكاميرا");
      } finally {
        setLoading(false);
      }
    };

    fetchCameraDetails();
  }, [cameraId]);

  useEffect(() => {
    if (!camera || !camera.hls_path) return;

    const video = document.getElementById("live-video");
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(camera.hls_path);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = camera.hls_path;
    }
  }, [camera]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg">جاري تحميل بيانات الكاميرا...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center py-10 text-2xl text-red-500">{error}</div>
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <button
          onClick={() => router.push("/employeeDashboard/cameras")}
          className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          العودة إلى القائمة
        </button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          تفاصيل الكاميرا: {camera.camera_id}
        </h1>
      </div>

      {/* Live Stream */}
      <div className="bg-white dark:bg-customDarkGreen rounded-lg p-6 mb-8 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-right">
          البث المباشر
        </h2>
        <div className="aspect-video w-full bg-black rounded-md overflow-hidden flex items-center justify-center">
          {camera.hls_path ? (
            <video
              id="live-video"
              controls
              autoPlay
              className="w-full h-full"
            ></video>
          ) : (
            <span className="text-white text-lg">البث غير متاح</span>
          )}
        </div>
      </div>

      {/* Camera Info */}
      <div
        className="bg-white dark:bg-customDarkGreen rounded-lg p-6 shadow-md"
        dir="rtl"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white text-right">
          معلومات الكاميرا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailCard label="معرف الكاميرا" value={camera.camera_id} />
          <DetailCard label="المحافظة" value={camera.governorate} />
          <DetailCard label="المنطقة" value={camera.region} />
          <DetailCard label="الشارع" value={camera.street} />
          <DetailCard
            label="تاريخ الإنشاء"
            value={
              camera.created_at
                ? new Date(camera.created_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "غير متوفر"
            }
          />
          <DetailCard
            label="تاريخ التحديث"
            value={
              camera.updated_at
                ? new Date(camera.updated_at).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "غير متوفر"
            }
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

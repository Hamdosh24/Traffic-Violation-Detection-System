"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StandardApi } from "@/app/api/StandarApi";

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

        // تحقق من وجود البيانات الأساسية
        if (!response.data || !response.data.camera_id) {
          throw new Error("بيانات الكاميرا غير مكتملة");
        }

        setCamera(response.data);
      } catch (err) {
        console.error("Error fetching camera details:", err);

        let errorMessage = err.message || "حدث خطأ أثناء جلب بيانات الكاميرا";

        // معالجة أخطاء محددة
        if (err.message.includes("انتهت صلاحية الجلسة")) {
          errorMessage = err.message;
          // يمكنك إضافة إعادة توجيه لتسجيل الدخول هنا إذا لزم الأمر
          // router.push("/login");
        } else if (err.message.includes("غير موجودة")) {
          errorMessage = "الكاميرا غير موجودة في النظام";
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCameraDetails();
  }, [cameraId]);

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

  if (!camera) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center py-10 text-2xl text-red-500">
          لا توجد بيانات متاحة للكاميرا
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
          className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mx-2"
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
          تفاصيل الكاميرا: {camera.camera_id}
        </h1>
      </div>

      {/* Live Stream Section */}
      <div className="bg-white dark:bg-customDarkGreen rounded-lg p-6 mb-8 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white text-right">
          البث المباشر
        </h2>
        <div className="aspect-video w-full bg-black rounded-md overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-white">
            سيتم إضافة رابط البث المباشر لاحقاً
          </div>
        </div>
      </div>

      {/* Camera Info Section */}
      <div className="bg-white dark:bg-customDarkGreen rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white text-right">
          معلومات الكاميرا
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailCard label="معرف الكاميرا" value={camera.camera_id} />
          <DetailCard label="الشارع" value={camera.street} />
          <DetailCard label="المنطقة" value={camera.region} />
          <DetailCard label="المحافظة" value={camera.governorate} />
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

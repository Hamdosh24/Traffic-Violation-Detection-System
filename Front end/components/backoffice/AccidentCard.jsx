"use client";
import { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Eye,
  CheckCheck,
  Camera,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccidentCard({ accident, onMarkAsViewed }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleMarkAsViewed = async (e) => {
    e.stopPropagation();
    if (accident.status === "acknowledged") return;

    setIsUpdating(true);
    try {
      await onMarkAsViewed(accident.id);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCameraStream = (e) => {
    e.stopPropagation();
    // التأكد من وجود البيانات قبل الانتقال
    if (accident.camera?.camera_id) {
      router.push(`/employeeDashboard/cameras/${accident.camera.camera_id}`);
    } else {
      console.error("Camera ID is not available.");
    }
  };

  const formattedDate = accident.timestamp
    ? new Date(accident.timestamp).toLocaleString("ar-EG", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "غير معروف";

  // استخدام optional chaining للوصول الآمن للبيانات
  const locationText = `${accident.camera?.street || "غير معروف"}, ${
    accident.camera?.region || "غير معروف"
  }, ${accident.camera?.governorate || "غير معروف"}`;
  const cameraID = accident.camera?.camera_id || "غير معروف";

  return (
    <div
      dir="rtl"
      className={`relative group overflow-hidden rounded-xl shadow-sm transition-all duration-200 hover:shadow-md ${
        accident.status === "new"
          ? "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10"
          : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
      }`}
    >
      {/* شريط الحالة الجانبي */}
      <div
        className={`absolute right-0 top-0 h-full w-1 ${
          accident.status === "new"
            ? "bg-red-500"
            : "bg-gray-300 dark:bg-gray-600"
        }`}
      ></div>

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* أيقونة الحالة */}
          <div
            className={`p-2 rounded-lg flex-shrink-0 ${
              accident.status === "new"
                ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            <AlertTriangle size={20} />
          </div>

          {/* محتوى البطاقة */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3
                  className={`font-medium ${
                    accident.status === "new"
                      ? "text-red-700 dark:text-red-300"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {`حادث في ${accident.camera?.street || "موقع غير معروف"}`}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {`منطقة ${accident.camera?.region || "غير معروفة"}`}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleMarkAsViewed}
                  disabled={isUpdating || accident.status === "acknowledged"}
                  className={`p-1.5 rounded-full transition-colors ${
                    accident.status === "new"
                      ? "text-red-600 hover:bg-red-100/50 dark:text-red-400 dark:hover:bg-red-900/20"
                      : "text-gray-400 cursor-default"
                  }`}
                  aria-label={
                    accident.status === "acknowledged"
                      ? "تمت المشاهدة"
                      : "تعليم كمشاهدة"
                  }
                >
                  {isUpdating ? (
                    <Clock size={18} className="animate-spin" />
                  ) : accident.status === "acknowledged" ? (
                    <CheckCheck className="text-customGreen" size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

                {/* زر الانتقال إلى بث الكاميرا - يظهر فقط للحوادث الجديدة */}
                {accident.status === "new" && (
                  <button
                    onClick={handleCameraStream}
                    className="p-1.5 rounded-full transition-colors text-blue-600 hover:bg-blue-100/50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    aria-label="عرض بث الكاميرا"
                  >
                    <Camera size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* معلومات الموقع */}
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center text-xs bg-white/80 dark:bg-gray-700/80 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                <MapPin size={12} className="ml-1 text-red-500" />
                {locationText}
              </span>
              <span className="inline-flex items-center text-xs bg-white/80 dark:bg-gray-700/80 px-2 py-1 rounded-full border border-gray-200 dark:border-gray-600">
                الكاميرا #{cameraID}
              </span>
            </div>

            {/* التاريخ والحالة */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Clock size={12} className="ml-1" />
                {formattedDate}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  accident.status === "new"
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {accident.status === "new" ? "جديد" : "تمت المشاهدة"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

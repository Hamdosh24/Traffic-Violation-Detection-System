"use client";
import { useState, useEffect } from "react";
import { AlertTriangle, Filter } from "lucide-react";
import AccidentList from "@/components/backoffice/AccidentList";
import useAccidentStore from "@/stores/useAccidentStore";

export default function AccidentsPage() {
  const [filter, setFilter] = useState("all");
  const {
    accidents,
    unviewedCount,
    isLoading,
    error,
    setupSSEConnection,
    cleanupSSE,
    markAsViewed,
    markAllAsViewed,
  } = useAccidentStore();

  useEffect(() => {
    setupSSEConnection();
    return () => cleanupSSE();
  }, [setupSSEConnection, cleanupSSE]);

  const filteredAccidents = accidents.filter((accident) => {
    if (filter === "acknowledged") return accident.acknowledged;
    if (filter === "unviewed") return !accident.isViewed;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto p-4" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="relative">
            {unviewedCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unviewedCount}
              </span>
            )}
            <AlertTriangle className="h-8 w-8 text-customGreen ml-2" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            الحوادث
          </h1>
        </div>

        <button
          onClick={markAllAsViewed}
          disabled={unviewedCount === 0 || isLoading}
          className="px-3 py-2 text-sm font-medium bg-customGreen text-white rounded-lg hover:bg-customGreen/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "جاري التحميل..." : "تعيين الكل كمشاهدة"}
        </button>
      </div>

      <div className="flex items-center mb-4 gap-2">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Filter className="h-4 w-4 ml-1" />
          <span>تصفية:</span>
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-customGreen focus:border-customGreen outline-none"
          >
            <option value="all">الكل</option>
            <option value="unviewed">غير المشاهدة</option>
            <option value="viewed">المشاهدة</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm backdrop-blur-sm">
        <AccidentList
          accidents={filteredAccidents}
          loading={isLoading}
          onMarkAsViewed={markAsViewed}
        />
      </div>
    </div>
  );
}

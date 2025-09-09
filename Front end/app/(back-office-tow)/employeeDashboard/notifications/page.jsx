"use client";
import { useState, useEffect, useCallback } from "react"; // أضف useCallback
import { AlertTriangle, Filter, RefreshCw } from "lucide-react";
import AccidentList from "@/components/backoffice/AccidentList";
import { StandardApi } from "@/app/api/StandarApi";
import { useSSE } from "@/context/SSEContext";

// Utility function to transform data
function transformSseData(data) {
  return {
    id: data.id || `temp-${Date.now()}`,
    status: data.status || "new",
    timestamp: data.timestamp || new Date().toISOString(),
    camera: data.camera || {
      camera_id: "غير معروف",
      governorate: "غير معروف",
      region: "غير معروف",
      street: "غير معروف",
      coordinates: "0,0",
    },
  };
}

export default function AccidentsPage() {
  const [allAccidents, setAllAccidents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const {
    isConnected,
    newAccidents,
    updateUnviewedCount,
    unviewedCount,
    clearNewAccidents,
  } = useSSE();

  // استخدم useCallback لجعل الدالة مستقرة
  const fetchAccidents = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await StandardApi.fetchAllAccidents();
      if (result.success) {
        const transformedData = result.data.map(transformSseData);
        setAllAccidents(transformedData);
        setAllAccidents((prev) => [...newAccidents, ...prev]);

        const newCount =
          newAccidents.length +
          transformedData.filter((a) => a.status === "new").length;
        updateUnviewedCount(newCount);
      } else {
        setError(result.error || "فشل في جلب الحوادث");
      }
    } catch (err) {
      setError("حدث خطأ أثناء جلب الحوادث");
      console.error("Error fetching accidents:", err);
    } finally {
      setIsLoading(false);
    }
  }, [newAccidents, updateUnviewedCount]); // أضف dependencies هنا

  const markAsViewed = async (accidentId) => {
    setIsLoading(true);
    try {
      const result = await StandardApi.markAccidentAsViewed(accidentId);
      if (result.success) {
        setAllAccidents((prevAccidents) => {
          const updatedAccidents = prevAccidents.map((acc) =>
            acc.id === accidentId ? { ...acc, status: "acknowledged" } : acc
          );
          return updatedAccidents;
        });
        updateUnviewedCount((prevCount) => Math.max(0, prevCount - 1));
      } else {
        setError(result.error || "فشل في تحديث الحادث");
      }
    } catch (err) {
      setError("حدث خطأ أثناء تحديث الحادث");
      console.error("Error marking as viewed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccidents();
  }, [fetchAccidents]); // أضف fetchAccidents إلى dependencies

  useEffect(() => {
    if (newAccidents.length > 0) {
      setAllAccidents((prev) => [...newAccidents, ...prev]);
      clearNewAccidents();
    }
  }, [newAccidents, clearNewAccidents]);

  const sortedAccidents = [...allAccidents].sort((a, b) => {
    if (a.status === "new" && b.status !== "new") return -1;
    if (a.status !== "new" && b.status === "new") return 1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const filteredAccidents = sortedAccidents.filter((accident) => {
    if (filter === "acknowledged") return accident.status === "acknowledged";
    if (filter === "new") return accident.status === "new";
    return true;
  });

  const totalCount = allAccidents.length;
  const newCount = allAccidents.filter((a) => a.status === "new").length;
  const acknowledgedCount = allAccidents.filter(
    (a) => a.status === "acknowledged"
  ).length;

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
        <div className="flex items-center gap-2">
          <div className="flex items-center text-sm">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-gray-600 dark:text-gray-300">
              {isConnected ? "متصل" : "غير متصل"}
            </span>
          </div>
          <button
            onClick={fetchAccidents}
            disabled={isLoading}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="تحديث القائمة"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
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
            <option value="all">الكل ({totalCount})</option>
            <option value="new">جديد ({newCount})</option>
            <option value="acknowledged">
              تمت مشاهدته ({acknowledgedCount})
            </option>
          </select>
        </div>
      </div>
      {error && (
        <div className="p-4 mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      {!isConnected && (
        <div className="p-4 mb-4 text-sm text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-lg">
          الاتصال غير نشط. جاري محاولة إعادة الاتصال تلقائياً...
        </div>
      )}
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-sm backdrop-blur-sm">
        <AccidentList
          accidents={filteredAccidents}
          loading={isLoading}
          onMarkAsViewed={markAsViewed}
          filter={filter}
        />
      </div>
      {filteredAccidents.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {filter === "all"
            ? "لا توجد حوادث حتى الآن"
            : filter === "new"
            ? "لا توجد حوادث جديدة"
            : "لا توجد حوادث تمت مشاهدتها"}
        </div>
      )}
    </div>
  );
}

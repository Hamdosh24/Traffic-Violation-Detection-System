"use client";
import React, { useState, useEffect, useCallback } from "react";
import { StandardApi } from "@/app/api/StandarApi";

const ChevronLeft = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19l-7-7 7-7"
    ></path>
  </svg>
);

const ChevronRight = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
  </svg>
);

// Skeleton Loading Component
const ActivityTableSkeleton = () => {
  const SkeletonRow = () => (
    <tr className="bg-white border-b dark:bg-customDarkGreenbg dark:border-gray-700">
      {[...Array(4)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-300/50 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div
      className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4"
      dir="rtl"
    >
      {/* Filter Skeleton */}
      <div className="p-4 bg-white dark:bg-customDarkGreenbg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-pulse">
        <div className="relative w-full md:w-80">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-40"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-32"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-32"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-28"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-customDarkGreen dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center dark:bg-customDarkGreen flex-column flex-wrap md:flex-row justify-between pt-4 p-5 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4 md:mb-0"></div>
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

const ACTION_TYPES = [
  "عرض قائمة الحسابات",
  "انشاء حساب",
  "البحث عن حساب",
  "تعديل بيانات حساب",
  "حذف حساب",
  "تسجيل دخول",
  "تسجيل خروج",
  "عرض الاحصاءات",
  "عرض سجل الانشطة",
  "عرض كل الكاميرات",
  "عرض كاميرا",
  "بحث عن لوحة",
  "عرض سجل المخالفات و الحوادث",
];

const getActionColor = (action) => {
  // استخراج الجزء العربي من الإجراء إذا كان بالصيغة "o1.taa "النص""
  const displayAction = action.includes('"') ? action.split('"')[1] : action;

  const colorMap = {
    "عرض قائمة الحسابات":
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    "انشاء حساب":
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "البحث عن حساب":
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    "تعديل بيانات حساب":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "حذف حساب": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "تسجيل دخول":
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "تسجيل خروج":
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    "عرض الاحصاءات":
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    "عرض سجل الانشطة":
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    "عرض كل الكاميرات":
      "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    "عرض كاميرا":
      "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
    "بحث عن لوحة":
      "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200",
    "عرض سجل المخالفات و الحوادث":
      "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  return colorMap[displayAction] || colorMap["default"];
};

export default function ActivityTable() {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("كل المستخدمين");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const [selectedAction, setSelectedAction] = useState("كل الاحداث");
  const [isFiltering, setIsFiltering] = useState(false);
  const itemsPerPage = 6;

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setIsFiltering(false);

    try {
      const {
        success,
        data,
        error: apiError,
      } = await StandardApi.fetchAllActivities();

      if (success) {
        setActivities(data);
        setFilteredActivities(data);
      } else {
        setError(apiError || "فشل في جلب سجل الأنشطة");
      }
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب سجل الأنشطة");
      console.error("Error fetching activities:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchFilteredActivities = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const filterParams = {
        username: searchTerm === "كل المستخدمين" ? null : searchTerm,
        action: selectedAction === "كل الاحداث" ? null : selectedAction,
        from_time: dateFilter.startDate || null,
        to_time: dateFilter.endDate || null,
      };
      console.log("username", searchTerm);
      console.log("action", selectedAction);
      console.log("from_time", dateFilter.startDate);
      console.log("to_time", dateFilter.endDate);

      // إزالة أي بارامترات غير محددة (null)
      const cleanParams = Object.fromEntries(
        Object.entries(filterParams).filter(([, v]) => v !== null)
      );

      console.log("username cleanParams", searchTerm);
      console.log("action cleanParams", selectedAction);
      console.log("from_time cleanParams", dateFilter.startDate);
      console.log("to_time cleanParams", dateFilter.endDate);

      const {
        success,
        data,
        error: apiError,
      } = await StandardApi.filterActivities(cleanParams);

      if (success) {
        setFilteredActivities(data);
        setIsFiltering(true);
        setCurrentPage(1);
      } else {
        setError(apiError || "فشل في تصفية الأنشطة");
      }
    } catch (err) {
      console.error("Filter error details:", err);
      setError(err.message || "حدث خطأ أثناء تصفية الأنشطة");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedAction, dateFilter]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const resetFilter = () => {
    setSearchTerm("");
    setSelectedAction("");
    setDateFilter({ startDate: "", endDate: "" });
    setIsFiltering(false);
    setCurrentPage(1);
    fetchActivities();
  };

  const applyFilter = () => {
    if (
      searchTerm ||
      selectedAction ||
      dateFilter.startDate ||
      dateFilter.endDate
    ) {
      fetchFilteredActivities();
    } else {
      resetFilter();
    }
  };

  const totalItems = filteredActivities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const itemStartIndex = (currentPage - 1) * itemsPerPage;
  const itemEndIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const currentPageData = filteredActivities.slice(
    itemStartIndex,
    itemEndIndex
  );

  const goToPage = (page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= 1) return null;

    pages.push(
      <li key={1}>
        <button
          onClick={() => goToPage(1)}
          className={`flex items-center justify-center px-3 h-8 leading-tight rounded-md mr-1 ${
            currentPage === 1
              ? "text-blue-700 bg-blue-100 dark:bg-customGreen dark:text-white"
              : "text-gray-500 hover:bg-slate-200 dark:bg-customDarkGreenbg dark:hover:bg-gray-500 dark:hover:text-white"
          }`}
        >
          1
        </button>
      </li>
    );

    if (currentPage > 3 && totalPages > maxVisiblePages) {
      pages.push(
        <li key="ellipsis-start" className="flex items-center px-2">
          ...
        </li>
      );
    }

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(totalPages - 3, 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(
          <li key={i}>
            <button
              onClick={() => goToPage(i)}
              className={`flex items-center justify-center px-3 h-8 leading-tight rounded-md ${
                currentPage === i
                  ? "text-blue-700 bg-blue-100 dark:bg-customGreen dark:text-white"
                  : "text-gray-500 hover:bg-slate-200 dark:bg-customDarkGreenbg dark:hover:bg-gray-500 dark:hover:text-white"
              }`}
            >
              {i}
            </button>
          </li>
        );
      }
    }

    if (currentPage < totalPages - 2 && totalPages > maxVisiblePages) {
      pages.push(
        <li key="ellipsis-end" className="flex items-center px-2">
          ...
        </li>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <li key={totalPages}>
          <button
            onClick={() => goToPage(totalPages)}
            className={`flex items-center justify-center px-3 h-8 leading-tight rounded-md ml-1 ${
              currentPage === totalPages
                ? "text-blue-700 bg-blue-100 dark:bg-customGreen dark:text-white"
                : "text-gray-500 hover:bg-slate-200 dark:bg-customDarkGreenbg dark:hover:bg-gray-500 dark:hover:text-white"
            }`}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pages;
  };

  if (isLoading && activities.length === 0) {
    return <ActivityTableSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4"
      dir="rtl"
    >
      <div className="p-4 bg-white dark:bg-customDarkGreenbg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 pr-10 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="كل المستخدمين"
            value={
              searchTerm === "كل المستخدمين" ? "كل المستخدمين" : searchTerm
            }
            onChange={(e) => setSearchTerm(e.target.value || "كل المستخدمين")}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              نوع الحدث:
            </label>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white min-w-[200px] w-full max-w-xs"
            >
              <option value="كل الاحداث">كل الأحداث</option>
              {ACTION_TYPES.map((action) => (
                <option
                  key={action}
                  value={action}
                  className="whitespace-normal"
                >
                  {action}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              من:
            </label>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, startDate: e.target.value })
              }
              className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-300">
              إلى:
            </label>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) =>
                setDateFilter({ ...dateFilter, endDate: e.target.value })
              }
              className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min={dateFilter.startDate}
            />
          </div>

          <button
            onClick={applyFilter}
            className="bg-customGreen hover:bg-emerald-700 text-white px-4 py-2 rounded  text-sm"
          >
            تطبيق الفلتر
          </button>

          {(isFiltering ||
            searchTerm ||
            selectedAction ||
            dateFilter.startDate ||
            dateFilter.endDate) && (
            <button
              onClick={resetFilter}
              className="text-gray-700 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm dark:bg-gray-600 dark:text-white"
            >
              إعادة تعيين
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-customDarkGreen dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                المستخدم
              </th>
              <th scope="col" className="px-6 py-3">
                الوقت
              </th>
              <th scope="col" className="px-6 py-3">
                الحدث
              </th>
              <th scope="col" className="px-6 py-3">
                الوصف
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((activity, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-customDarkGreenbg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {activity.user_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {activity.time.split(" ")[0]}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                        activity.action
                      )}`}
                    >
                      {activity.action.includes('"')
                        ? activity.action.split('"')[1]
                        : activity.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">
                    {activity.description}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white dark:bg-gray-800">
                <td colSpan="4" className="px-6 py-4 text-center">
                  {isFiltering
                    ? "لا توجد نتائج مطابقة للفلتر"
                    : "لا توجد أنشطة متاحة"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalItems > 0 && (
        <nav className="flex items-center dark:bg-customDarkGreen flex-column flex-wrap md:flex-row justify-between pt-4 p-5">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            عرض{" "}
            <span className="font-semibold text-gray-90 dark:text-white">
              {itemStartIndex + 1}-{itemEndIndex}
            </span>{" "}
            من{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalItems}
            </span>
          </span>
          <ul className="inline-flex -space-x-px text-sm h-8">
            <li>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 rounded-s-lg hover:text-blue-700 dark:bg-customDarkGreenbg dark:border-slate-600 dark:text-gray-400 dark:hover:text-white"
              >
                <ChevronRight />
              </button>
            </li>
            {renderPageNumbers()}
            <li>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 rounded-e-lg hover:text-blue-700 dark:bg-customDarkGreenbg dark:border-slate-600 dark:text-gray-400 dark:hover:text-white"
              >
                <ChevronLeft />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

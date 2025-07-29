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

const getActionColor = (action) => {
  const actionType = action.toLowerCase();
  const colorMap = {
    login: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    view: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    create: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    update:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    delete: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  if (actionType.includes("login")) return colorMap.login;
  if (actionType.includes("view")) return colorMap.view;
  if (actionType.includes("create")) return colorMap.create;
  if (actionType.includes("update")) return colorMap.update;
  if (actionType.includes("delete")) return colorMap.delete;
  return colorMap.default;
};

export default function ActivityTable() {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  const fetchActivities = useCallback(async (query = "") => {
    setIsLoading(true);
    setError("");

    try {
      let endpoint = "/activity-logs";
      if (query) {
        endpoint = `/activity-logs/search?query=${encodeURIComponent(query)}`;
      }

      const {
        success,
        data,
        error: apiError,
      } = await StandardApi.get(endpoint);

      if (success) {
        setActivities(data);
        setTotalItems(data.length);
      } else {
        setError(apiError || "Failed to fetch activities");
      }
    } catch (err) {
      const errorMessage =
        err?.message || err?.toString() || "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error fetching activities:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // البحث مع إلغاء الطلبات السريعة
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivities(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchActivities]);

  // جلب البيانات الأولية
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // التقسيم المحلي للبيانات
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const itemStartIndex = (currentPage - 1) * itemsPerPage;
  const itemEndIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const currentPageData = activities.slice(itemStartIndex, itemEndIndex);

  const goToPage = (page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  if (isLoading && activities.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
      <div className="p-4 bg-white dark:bg-customDarkGreenbg flex justify-start items-center">
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 pl-10 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Search by name or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-customDarkGreen dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">User</th>
            <th className="px-6 py-3">Time</th>
            <th className="px-6 py-3">Action</th>
            <th className="px-6 py-3">Description</th>
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
                <td className="px-6 py-4">{activity.time}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                      activity.action
                    )}`}
                  >
                    {activity.action}
                  </span>
                </td>
                <td className="px-6 py-4">{activity.description}</td>
              </tr>
            ))
          ) : (
            <tr className="bg-white dark:bg-gray-800">
              <td colSpan="4" className="px-6 py-4 text-center">
                {searchTerm
                  ? "No matching activities found"
                  : "No activities available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalItems > 0 && (
        <nav className="flex items-center dark:bg-customDarkGreen flex-column flex-wrap md:flex-row justify-between pt-4 p-5">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Showing{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {itemStartIndex + 1}-{itemEndIndex}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalItems}
            </span>
          </span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 rounded-s-lg hover:text-blue-700 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400 dark:hover:text-white"
              >
                <ChevronLeft />
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index}>
                <button
                  onClick={() => goToPage(index + 1)}
                  className={`flex items-center justify-center px-3 h-8 leading-tight rounded-md ${
                    currentPage === index + 1
                      ? "text-blue-700 bg-blue-100 dark:bg-customGreen dark:text-white"
                      : "text-gray-500 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-gray-500 dark:hover:text-white"
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 rounded-e-lg hover:text-blue-700 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400 dark:hover:text-white"
              >
                <ChevronRight />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

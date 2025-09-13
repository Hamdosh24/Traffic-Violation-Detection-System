"use client";
import React, { useState, useEffect, useCallback } from "react";
import { StandardApi } from "@/app/api/StandarApi";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

export default function ViolationTable() {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);
  const [reportType, setReportType] = useState("مخالفات");
  const [violationTypes, setViolationTypes] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 6;

  // الفلاتر
  const [filters, setFilters] = useState({
    type_name: "كل المخالفات",
    governorate: "كل المحافظات",
    region: "كل المناطق",
    from_date: "",
    to_date: "",
  });

  // جلب الفلاتر (أنواع المخالفات والمحافظات والمناطق)
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setFiltersLoading(true);
        const response =
          await StandardApi.fetchViolationFiltersByRegionandrecords();

        if (response.success) {
          const typesFromApi = response.data.violation_types || [];
          const govsFromApi = response.data.governorates || [];

          setViolationTypes(typesFromApi);
          setGovernorates(govsFromApi);

          // تعيين القيم الافتراضية للفلاتر
          if (typesFromApi.length > 0) {
            setFilters((prev) => ({ ...prev, type_name: typesFromApi[0] }));
          }
          if (govsFromApi.length > 0) {
            setFilters((prev) => ({ ...prev, governorate: govsFromApi[0] }));
          }
        } else {
          setError(response.error || "فشل في جلب الفلاتر");
        }
      } catch (err) {
        console.error("خطأ في جلب الفلاتر:", err);
        setError(err.message || "حدث خطأ أثناء جلب الفلاتر");
      } finally {
        setFiltersLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // جلب البيانات بدون فلتر
  const fetchViolations = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setIsFiltering(false);

    try {
      const {
        success,
        data,
        error: apiError,
      } = await StandardApi.fetchRecords({});

      if (success) {
        setViolations(data);
        setFilteredViolations(data);
      } else {
        setError(apiError || "فشل في جلب سجل المخالفات");
      }
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب سجل المخالفات");
      console.error("Error fetching violations:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // جلب البيانات مع الفلتر
  const fetchFilteredViolations = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      // تنظيف الفلاتر - إزالة القيم الافتراضية إذا كانت فارغة
      const cleanFilters = { ...filters };

      // إذا كان نوع التقرير حوادث، نرسل "حوادث" كنوع
      if (reportType === "حوادث") {
        cleanFilters.type_name = "حوادث";
      } else {
        // إذا كان نوع التقرير مخالفات، نتعامل مع نوع المخالفة المحدد
        if (cleanFilters.type_name === "كل المخالفات")
          cleanFilters.type_name = "";
      }

      if (cleanFilters.governorate === "كل المحافظات")
        cleanFilters.governorate = "";
      if (cleanFilters.region === "كل المناطق") cleanFilters.region = "";

      const {
        success,
        data,
        error: apiError,
      } = await StandardApi.fetchRecords(cleanFilters);

      if (success) {
        setFilteredViolations(data);
        setIsFiltering(true);
        setCurrentPage(1);
      } else {
        setError(apiError || "فشل في تصفية البيانات");
      }
    } catch (err) {
      console.error("Filter error details:", err);
      setError(err.message || "حدث خطأ أثناء تصفية البيانات");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [filters, reportType]);

  useEffect(() => {
    fetchViolations();
  }, [fetchViolations]);

  // دالة التحديث
  const handleRefresh = () => {
    setRefreshing(true);
    resetFilter();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
    // إعادة تعيين نوع المخالفة عند تغيير نوع التقرير
    if (value === "حوادث") {
      setFilters((prev) => ({ ...prev, type_name: "حوادث" }));
    } else {
      setFilters((prev) => ({
        ...prev,
        type_name:
          violationTypes.length > 0 ? violationTypes[0] : "كل المخالفات",
      }));
    }
  };

  const applyFilter = () => {
    fetchFilteredViolations();
  };

  const resetFilter = () => {
    setFilters({
      type_name:
        reportType === "حوادث"
          ? "حوادث"
          : violationTypes.length > 0
          ? violationTypes[0]
          : "كل المخالفات",
      governorate: governorates.length > 0 ? governorates[0] : "كل المحافظات",
      region: "كل المناطق",
      from_date: "",
      to_date: "",
    });
    setIsFiltering(false);
    setCurrentPage(1);
    fetchViolations();
  };

  // حساب Pagination
  const totalItems = filteredViolations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const itemStartIndex = (currentPage - 1) * itemsPerPage;
  const itemEndIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const currentPageData = filteredViolations.slice(
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
          className={`flex items-center justify-center px-3 h-8 leading-tight rounded-md ${
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
            className={`flex items-center justify-center px-3 h-8 leading-tight rounded-md ${
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

  // Skeleton Loading للجدول
  const TableSkeleton = () => {
    return (
      <div className="animate-pulse">
        <div className="p-4 bg-white dark:bg-customDarkGreenbg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 w-full">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1 w-1/3"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-customDarkGreen dark:text-gray-400">
              <tr>
                {[...Array(7)].map((_, i) => (
                  <th key={i} scope="col" className="px-3 py-3 sm:px-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-white border-b dark:bg-customDarkGreenbg dark:border-gray-700"
                >
                  {[...Array(7)].map((_, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-4 sm:px-6">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center dark:bg-customDarkGreen justify-between pt-4 p-5 gap-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-8"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading && violations.length === 0) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4"
      dir="rtl"
    >
      {/* قسم الفلاتر */}
      <div className="p-4 bg-white dark:bg-customDarkGreenbg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 w-full">
          {/* نوع التقرير (مخالفات/حوادث) */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              نوع التقرير
            </label>
            <select
              dir="ltr"
              value={reportType}
              onChange={(e) => handleReportTypeChange(e.target.value)}
              className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={filtersLoading}
            >
              <option value="مخالفات">مخالفات</option>
              <option value="حوادث">حوادث</option>
            </select>
          </div>

          {/* نوع المخالفة (يظهر فقط عند اختيار "مخالفات") */}
          {reportType === "مخالفات" && (
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                نوع المخالفة
              </label>
              <select
                dir="ltr"
                value={filters.type_name}
                onChange={(e) =>
                  handleFilterChange("type_name", e.target.value)
                }
                className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={filtersLoading || violationTypes.length === 0}
              >
                <option value="كل المخالفات">كل المخالفات</option>
                {violationTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* المحافظة */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              المحافظة
            </label>
            <select
              dir="ltr"
              value={filters.governorate}
              onChange={(e) =>
                handleFilterChange("governorate", e.target.value)
              }
              className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={filtersLoading || governorates.length === 0}
            >
              <option value="كل المحافظات">كل المحافظات</option>
              {governorates.map((gov, index) => (
                <option key={index} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          {/* المنطقة */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              المنطقة
            </label>
            <select
              dir="ltr"
              value={filters.region}
              onChange={(e) => handleFilterChange("region", e.target.value)}
              className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="كل المناطق">كل المناطق</option>
              {/* يمكن إضافة المناطق الديناميكية هنا إذا كانت متوفرة في API */}
              <option value="المزة">المزة</option>
              <option value="المرجة">المرجة</option>
              <option value="الشعلان">الشعلان</option>
              <option value="القدم">القدم</option>
            </select>
          </div>

          {/* من تاريخ */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              من تاريخ
            </label>
            <input
              type="date"
              value={filters.from_date}
              onChange={(e) => handleFilterChange("from_date", e.target.value)}
              className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* إلى تاريخ */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              إلى تاريخ
            </label>
            <input
              type="date"
              value={filters.to_date}
              onChange={(e) => handleFilterChange("to_date", e.target.value)}
              className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min={filters.from_date}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
          {/* زر التحديث */}
          <button
            onClick={handleRefresh}
            disabled={refreshing || filtersLoading}
            className="flex items-center gap-1 bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 text-sm dark:bg-gray-600 dark:text-white disabled:opacity-50"
            title="تحديث البيانات"
          >
            <RefreshCw className="w-4 h-4" />
            {refreshing ? "جاري التحديث..." : "تحديث"}
          </button>

          <button
            onClick={applyFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
            disabled={filtersLoading}
          >
            {filtersLoading ? "جاري التحميل..." : "تطبيق الفلتر"}
          </button>

          {(isFiltering ||
            (reportType === "مخالفات" &&
              filters.type_name !==
                (violationTypes.length > 0
                  ? violationTypes[0]
                  : "كل المخالفات")) ||
            filters.governorate !==
              (governorates.length > 0 ? governorates[0] : "كل المحافظات") ||
            filters.region !== "كل المناطق" ||
            filters.from_date ||
            filters.to_date) && (
            <button
              onClick={resetFilter}
              className="text-gray-700 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm dark:bg-gray-600 dark:text-white disabled:opacity-50"
              disabled={filtersLoading}
            >
              إعادة تعيين
            </button>
          )}
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-customDarkGreen dark:text-gray-400">
            <tr>
              <th scope="col" className="px-3 py-3 sm:px-6">
                رقم اللوحة
              </th>
              <th scope="col" className="px-3 py-3 sm:px-6">
                النوع
              </th>
              <th scope="col" className="px-3 py-3 sm:px-6">
                التاريخ والوقت
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 hidden md:table-cell"
              >
                المحافظة
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 hidden lg:table-cell"
              >
                المنطقة
              </th>
              <th
                scope="col"
                className="px-3 py-3 sm:px-6 hidden xl:table-cell"
              >
                الشارع
              </th>
              <th scope="col" className="px-3 py-3 sm:px-6">
                رقم الكاميرا
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length > 0 ? (
              currentPageData.map((violation, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-customDarkGreenbg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-3 py-4 font-medium text-gray-900 dark:text-white sm:px-6">
                    {violation.plate_num || "N/A"}
                  </td>
                  <td className="px-3 py-4 sm:px-6">
                    {violation.type_name || "N/A"}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                    {violation.timestamp}
                  </td>
                  <td className="px-3 py-4 sm:px-6 hidden md:table-cell">
                    {violation.governorate}
                  </td>
                  <td className="px-3 py-4 sm:px-6 hidden lg:table-cell">
                    {violation.region}
                  </td>
                  <td className="px-3 py-4 sm:px-6 hidden xl:table-cell">
                    {violation.street}
                  </td>
                  <td className="px-3 py-4 sm:px-6">{violation.camera_id}</td>
                </tr>
              ))
            ) : (
              <tr className="bg-white dark:bg-gray-800">
                <td colSpan="7" className="px-6 py-4 text-center">
                  {isFiltering
                    ? "لا توجد نتائج مطابقة للفلتر"
                    : `لا توجد ${
                        reportType === "حوادث" ? "حوادث" : "مخالفات"
                      } متاحة`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <nav className="flex flex-col sm:flex-row items-center dark:bg-customDarkGreen justify-between pt-4 p-5 gap-4">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            عرض{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
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
                className="flex items-center justify-center px-3 ml-1 h-8 ms-0 leading-tight text-gray-500 rounded-s-lg hover:text-blue-700 dark:bg-customDarkGreenbg dark:border-slate-600 dark:text-gray-400 dark:hover:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </li>
            {renderPageNumbers()}
            <li>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-3 mr-1 h-8 leading-tight text-gray-500 rounded-e-lg hover:text-blue-700 dark:bg-customDarkGreenbg dark:border-slate-600 dark:text-gray-400 dark:hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

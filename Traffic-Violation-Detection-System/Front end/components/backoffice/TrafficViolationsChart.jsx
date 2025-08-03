"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { utils, writeFile } from "xlsx";
import { useReactToPrint } from "react-to-print";
import { StandardApi } from "@/app/api/StandarApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TrafficViolationsChart() {
  const [violationData, setViolationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [startDate, setStartDate] = useState(new Date(2025, 0, 1));
  const [endDate, setEndDate] = useState(new Date(2025, 6, 24));
  const [currentPage, setCurrentPage] = useState(0);
  const [violationTypes, setViolationTypes] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [reportType, setReportType] = useState("مخالفات"); // ['حوادث', 'مخالفات']
  const itemsPerPage = 30;
  const componentRef = useRef();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  // جلب أنواع المخالفات عند التحميل
  useEffect(() => {
    const fetchViolationTypes = async () => {
      try {
        setFiltersLoading(true);
        const response = await StandardApi.fetchViolationFilters();

        if (response.success) {
          const typesFromApi = response.data.violation_types || [];
          setViolationTypes(typesFromApi);

          if (typesFromApi.length > 0) {
            setSelectedType(typesFromApi[0]);
          }
        } else {
          throw new Error(response.error || "فشل في جلب أنواع المخالفات");
        }
      } catch (err) {
        console.error("خطأ في جلب أنواع المخالفات:", err);
        setError(err.message);
      } finally {
        setFiltersLoading(false);
      }
    };

    if (reportType === "مخالفات") {
      fetchViolationTypes();
    }
  }, [reportType]);

  const fetchViolationData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        type_name: reportType === "حوادث" ? "حوادث" : selectedType,
        from_date: formatDate(startDate),
        to_date: formatDate(endDate),
      };

      const { success, data, error } =
        await StandardApi.fetchViolationsByRegion(params);

      if (!success) {
        throw new Error(error || "فشل في جلب البيانات");
      }

      setViolationData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
      console.error("تفاصيل الخطأ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    setCurrentPage(0);
    fetchViolationData();
  };

  const { paginatedData, totalPages, allData } = useMemo(() => {
    const sortedData = [...violationData].sort((a, b) => b.count - a.count);
    return {
      paginatedData: sortedData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      ),
      totalPages: Math.ceil(sortedData.length / itemsPerPage),
      allData: sortedData,
    };
  }, [violationData, currentPage]);

  const chartData = useMemo(
    () => ({
      labels: paginatedData.map((item) => item.region),
      datasets: [
        {
          label: "عدد المخالفات",
          data: paginatedData.map((item) => item.count),
          backgroundColor:
            reportType === "حوادث" ? "rgb(220, 53, 69)" : "rgb(13, 158, 109)",
          borderColor:
            reportType === "حوادث"
              ? "rgba(220, 53, 69, 0.7)"
              : "rgba(13, 158, 109, 0.7)",
          borderWidth: 1,
        },
      ],
    }),
    [paginatedData, reportType]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text:
          reportType === "حوادث"
            ? "توزيع الحوادث المرورية حسب المنطقة"
            : "توزيع المخالفات المرورية حسب المنطقة",
        font: {
          size: 16,
          family: "'Tajawal', sans-serif",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            ` ${context.parsed.y} ${
              reportType === "حوادث" ? "حادث" : "مخالفة"
            }`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
            family: "'Tajawal', sans-serif",
          },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: reportType === "حوادث" ? "عدد الحوادث" : "عدد المخالفات",
          font: {
            size: 12,
            family: "'Tajawal', sans-serif",
          },
        },
        ticks: {
          stepSize: 20,
          font: {
            family: "'Tajawal', sans-serif",
          },
        },
      },
    },
    barPercentage: 0.8,
    categoryPercentage: 0.9,
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(
        allData.map((item) => ({
          المنطقة: item.region,
          [reportType === "حوادث" ? "عدد الحوادث" : "عدد المخالفات"]:
            item.count,
          "نوع التقرير": reportType,
          "نوع المخالفة": reportType === "حوادث" ? "حوادث" : selectedType,
          "الفترة الزمنية": `من ${startDate.toLocaleDateString(
            "ar-EG"
          )} إلى ${endDate.toLocaleDateString("ar-EG")}`,
        }))
      );

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "التقرير");
      writeFile(
        wb,
        `تقرير_${reportType}_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (err) {
      console.error("خطأ في التصدير:", err);
      alert("حدث خطأ أثناء التصدير، يرجى المحاولة لاحقاً");
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page { size: A4 landscape; margin: 10mm; }
      body {
        direction: rtl;
        font-family: 'Tajawal', sans-serif;
      }
      .print-header {
        text-align: center;
        margin-bottom: 20px;
        font-family: 'Tajawal', sans-serif;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        font-family: 'Tajawal', sans-serif;
      }
      .print-table th, .print-table td {
        border: 1px solid #ddd;
        padding: 8px;
        font-family: 'Tajawal', sans-serif;
      }
    `,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        <p className="font-bold">خطأ في جلب البيانات:</p>
        <p>{error}</p>
        <button
          onClick={applyFilters}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="bg-milkColor dark:bg-customDarkGreen p-4 md:p-6 rounded-lg shadow-md">
      {/* Hidden Print Content */}
      <div className="hidden">
        <div ref={componentRef} className="p-4">
          <h1 className="print-header text-xl font-bold">
            {reportType === "حوادث"
              ? "تقرير الحوادث المرورية"
              : "تقرير المخالفات المرورية"}
          </h1>
          <div className="mb-4">
            <p>
              <strong>نوع التقرير:</strong> {reportType}
            </p>
            {reportType === "مخالفات" && (
              <p>
                <strong>نوع المخالفة:</strong> {selectedType}
              </p>
            )}
            <p>
              <strong>الفترة الزمنية:</strong> من{" "}
              {startDate.toLocaleDateString("ar-EG")} إلى{" "}
              {endDate.toLocaleDateString("ar-EG")}
            </p>
          </div>
          <table className="print-table">
            <thead>
              <tr>
                <th>المنطقة</th>
                <th>
                  {reportType === "حوادث" ? "عدد الحوادث" : "عدد المخالفات"}
                </th>
              </tr>
            </thead>
            <tbody>
              {allData.map((item) => (
                <tr key={item.region}>
                  <td>{item.region}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3 md:gap-4">
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            disabled={violationData.length === 0 || isLoading}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1 disabled:opacity-50 min-w-[120px] justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Excel
          </button>

          <button
            onClick={handlePrint}
            disabled={violationData.length === 0 || isLoading}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50 min-w-[120px] justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            طباعة
          </button>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
          {reportType === "حوادث"
            ? "إحصائيات الحوادث المرورية"
            : "إحصائيات المخالفات المرورية"}
        </h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex flex-col items-end">
          <label className="block mb-1 md:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            نوع التقرير
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-sm md:text-base"
          >
            <option value="حوادث">حوادث</option>
            <option value="مخالفات">مخالفات</option>
          </select>
        </div>

        <div className="flex flex-col items-end col-span-1 sm:col-span-2 lg:col-span-1">
          <label className="block mb-1 md:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            نوع المخالفة
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-sm md:text-base"
            disabled={
              filtersLoading ||
              violationTypes.length === 0 ||
              reportType === "حوادث"
            }
          >
            {violationTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-end">
          <label className="block mb-1 md:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            من تاريخ
          </label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-sm md:text-base"
          />
        </div>

        <div className="flex flex-col items-end">
          <label className="block mb-1 md:mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            إلى تاريخ
          </label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-sm md:text-base"
          />
        </div>

        <div className="flex items-end col-span-1 sm:col-span-2 lg:col-span-1">
          <button
            onClick={applyFilters}
            className="w-full px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm md:text-base"
            disabled={
              filtersLoading || (reportType === "مخالفات" && !selectedType)
            }
          >
            {filtersLoading ? "جاري التحميل..." : "تطبيق الفلاتر"}
          </button>
        </div>
      </div>

      {/* Chart */}
      {violationData.length > 0 && (
        <div className="bg-white dark:bg-customDarkGreenbg p-3 md:p-4 rounded-lg mb-4 md:mb-6">
          <div className="h-64 md:h-80 w-full">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Pagination */}
      {violationData.length > 0 && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            الصفحة {currentPage + 1} من {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="px-2 py-1 md:px-3 md:py-1 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50 text-xs md:text-sm"
            >
              السابق
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page =
                currentPage < 2
                  ? i
                  : currentPage > totalPages - 3
                  ? totalPages - 5 + i
                  : currentPage - 2 + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2 py-1 md:px-3 md:py-1 rounded text-xs md:text-sm ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  {page + 1}
                </button>
              );
            })}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
              }
              disabled={currentPage === totalPages - 1}
              className="px-2 py-1 md:px-3 md:py-1 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50 text-xs md:text-sm"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect, useRef } from "react";
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

export default function TrafficViolationsChartByTime() {
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filters, setFilters] = useState({
    regions: [],
    governorates: [],
    violation_types: [],
  });
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [reportType, setReportType] = useState("مخالفات"); // ['حوادث', 'مخالفات']
  const chartRef = useRef();
  const componentRef = useRef();

  // جلب بيانات الفلاتر عند تحميل الصفحة
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setFiltersLoading(true);
        const response = await StandardApi.get("/violations/filters/by-hour");

        if (response.success) {
          setFilters(response.data);

          // تعيين أول قيمة متاحة لكل فلتر
          if (response.data.violation_types.length > 0) {
            setSelectedType(response.data.violation_types[0]);
          }
          if (response.data.governorates.length > 0) {
            setSelectedGovernorate(response.data.governorates[0]);
          }
          if (response.data.regions.length > 0) {
            setSelectedLocation(response.data.regions[0]);
          }
        } else {
          throw new Error(response.error || "Failed to fetch filters");
        }
      } catch (err) {
        console.error("Error fetching filters:", err);
        setError(err.message);
      } finally {
        setFiltersLoading(false);
      }
    };

    if (reportType === "مخالفات") {
      fetchFilters();
    }
  }, [reportType]);

  const fetchHourlyViolations = async () => {
    try {
      if (
        reportType === "مخالفات" &&
        (!selectedType || !selectedGovernorate || !selectedLocation)
      ) {
        throw new Error("الرجاء تحديد جميع الفلاتر المطلوبة");
      }

      setLoading(true);
      setError(null);

      const params = {
        type_name: reportType === "حوادث" ? "حوادث" : selectedType,
        governorate: selectedGovernorate,
        region: selectedLocation,
        from_date: formatDate(startDate),
        to_date: formatDate(endDate),
      };

      const response = await StandardApi.fetchViolationsByHour(params);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch data");
      }

      setHourlyData(response.data);
    } catch (err) {
      console.error("Error fetching hourly violations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const prepareChartData = () => {
    if (!hourlyData) return null;

    const labels = Object.keys(hourlyData).map((hourRange) => {
      const [startHour, endHour] = hourRange.split("-");
      return `${startHour}:00 - ${endHour}:00`;
    });

    const data = Object.values(hourlyData);

    return {
      labels,
      datasets: [
        {
          label: reportType === "حوادث" ? "عدد الحوادث" : "عدد المخالفات",
          data,
          backgroundColor:
            reportType === "حوادث"
              ? "rgba(220, 53, 69, 0.7)"
              : "rgba(54, 162, 235, 0.7)",
          borderColor:
            reportType === "حوادث"
              ? "rgba(220, 53, 69, 1)"
              : "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = prepareChartData();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `توزيع ${
          reportType === "حوادث" ? "الحوادث" : "المخالفات"
        } المرورية حسب ساعات اليوم ${
          selectedLocation ? `في ${selectedLocation}` : ""
        }`,
        font: {
          size: 16,
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
            size: 10,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: reportType === "حوادث" ? "عدد الحوادث" : "عدد المخالفات",
          font: {
            size: 12,
          },
        },
        ticks: {
          stepSize: 5,
        },
      },
    },
    maintainAspectRatio: false,
    barPercentage: 0.8,
    categoryPercentage: 0.9,
  };

  const exportToExcel = () => {
    if (!hourlyData) return;

    const mainData = Object.entries(hourlyData).map(([hourRange, count]) => ({
      "الفترة الزمنية": hourRange.replace("-", ":00 - ") + ":00",
      [reportType === "حوادث" ? "عدد الحوادث" : "عدد المخالفات"]: count,
      "نوع التقرير": reportType,
      "نوع المخالفة": reportType === "حوادث" ? "حوادث" : selectedType,
      المحافظة: selectedGovernorate,
      المنطقة: selectedLocation,
      التاريخ: `من ${formatDate(startDate)} إلى ${formatDate(endDate)}`,
    }));

    const violationTypesData =
      reportType === "مخالفات"
        ? filters.violation_types.map((type) => ({
            "نوع المخالفة": type,
          }))
        : [];

    const wb = utils.book_new();
    const wsMain = utils.json_to_sheet(mainData);
    utils.book_append_sheet(wb, wsMain, "البيانات حسب الساعة");

    if (reportType === "مخالفات") {
      const wsViolations = utils.json_to_sheet(violationTypesData);
      utils.book_append_sheet(wb, wsViolations, "أنواع المخالفات");
    }

    const totalViolations = Object.values(hourlyData).reduce(
      (sum, count) => sum + count,
      0
    );
    const averageViolations = totalViolations / Object.keys(hourlyData).length;
    const maxHour = Object.entries(hourlyData).reduce(
      (max, [hour, count]) => (count > max.count ? { hour, count } : max),
      { hour: "", count: 0 }
    );

    const summaryData = [
      [
        `إجمالي ${reportType === "حوادث" ? "الحوادث" : "المخالفات"}`,
        totalViolations,
      ],
      [
        `متوسط ${reportType === "حوادث" ? "الحوادث" : "المخالفات"} لكل ساعة`,
        averageViolations.toFixed(2),
      ],
      [
        `أعلى ساعة في ${reportType === "حوادث" ? "الحوادث" : "المخالفات"}`,
        maxHour.hour.replace("-", ":00 - ") + ":00",
      ],
      ["عدد الساعات", Object.keys(hourlyData).length],
    ];

    const wsSummary = utils.aoa_to_sheet(summaryData);
    utils.book_append_sheet(wb, wsSummary, "ملخص البيانات");

    writeFile(
      wb,
      `تقرير_${
        reportType === "حوادث" ? "الحوادث" : "المخالفات"
      }_حسب_الساعة_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      @media print {
        body {
          direction: rtl;
        }
        .print-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .print-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 20px;
        }
        .print-filter-item {
          margin-left: 15px;
        }
        .print-chart-container {
          width: 100%;
          height: 400px;
          margin: 20px 0;
        }
        .print-data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
        }
        .print-data-table th, .print-data-table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: right;
        }
        .print-data-table th {
          background-color: #f2f2f2;
        }
      }
    `,
  });

  return (
    <div className="bg-milkColor dark:bg-customDarkGreen p-4 md:p-6 rounded-md shadow-xl">
      {/* Reference for printing */}
      <div className="hidden">
        <div ref={componentRef} className="p-6">
          <div className="print-header">
            <h1 className="text-2xl font-bold">
              تقرير {reportType === "حوادث" ? "الحوادث" : "المخالفات"} المرورية
            </h1>
            <p className="text-gray-600">
              تاريخ التقرير: {new Date().toLocaleDateString("ar-EG")}
            </p>
          </div>

          <div className="print-filters">
            <div className="print-filter-item">
              <strong>نوع التقرير: </strong>
              {reportType}
            </div>
            {reportType === "مخالفات" && (
              <div className="print-filter-item">
                <strong>نوع المخالفة: </strong>
                {selectedType}
              </div>
            )}
            <div className="print-filter-item">
              <strong>المحافظة: </strong>
              {selectedGovernorate}
            </div>
            <div className="print-filter-item">
              <strong>المنطقة: </strong>
              {selectedLocation}
            </div>
            <div className="print-filter-item">
              <strong>الفترة الزمنية: </strong>
              من {formatDate(startDate)} إلى {formatDate(endDate)}
            </div>
          </div>

          {chartData && (
            <div className="print-chart-container">
              <Bar data={chartData} options={options} />
            </div>
          )}

          {hourlyData && (
            <table className="print-data-table">
              <thead>
                <tr>
                  <th>الفترة الزمنية</th>
                  <th>
                    {reportType === "حوادث" ? "عدد الحوادث" : "عدد المخالفات"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(hourlyData).map(([hourRange, count]) => (
                  <tr key={hourRange}>
                    <td>{hourRange.replace("-", ":00 - ") + ":00"}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <button
            onClick={fetchHourlyViolations}
            disabled={
              loading ||
              filtersLoading ||
              (reportType === "مخالفات" &&
                (!selectedType || !selectedGovernorate || !selectedLocation))
            }
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50 min-w-[120px] justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                جاري التحميل...
              </>
            ) : (
              <>
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                جلب البيانات
              </>
            )}
          </button>
          <button
            onClick={exportToExcel}
            disabled={!hourlyData}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1 disabled:opacity-50 min-w-[100px] justify-center"
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
            disabled={!hourlyData}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50 min-w-[100px] justify-center"
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
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50 text-center md:text-right">
          توزيع عدد {reportType === "حوادث" ? "الحوادث" : "المخالفات"} المرورية
          حسب ساعات اليوم
        </h2>
      </div>

      {/* فلترات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col items-end">
          <label className="block mb-2 text-sm font-medium dark:text-gray-300">
            نوع التقرير
          </label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={reportType}
            onChange={(e) => {
              setReportType(e.target.value);
              setHourlyData(null); // إعادة تعيين البيانات عند تغيير نوع التقرير
            }}
          >
            <option value="حوادث">حوادث</option>
            <option value="مخالفات">مخالفات</option>
          </select>
        </div>

        <div className="flex flex-col items-end">
          <label className="block mb-2 text-sm font-medium dark:text-gray-300">
            نوع المخالفة
          </label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            disabled={filtersLoading || reportType === "حوادث"}
          >
            {filters.violation_types.length > 0 ? (
              filters.violation_types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))
            ) : (
              <option value="">
                {filtersLoading ? "جاري التحميل..." : "لا توجد بيانات"}
              </option>
            )}
          </select>
        </div>

        <div className="flex flex-col items-end">
          <label className="block mb-2 text-sm font-medium dark:text-gray-300">
            المحافظة
          </label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedGovernorate}
            onChange={(e) => {
              setSelectedGovernorate(e.target.value);
              setSelectedLocation(filters.regions[0] || "");
            }}
            disabled={filtersLoading}
          >
            {filters.governorates.length > 0 ? (
              filters.governorates.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))
            ) : (
              <option value="">
                {filtersLoading ? "جاري التحميل..." : "لا توجد بيانات"}
              </option>
            )}
          </select>
        </div>

        <div className="flex flex-col items-end">
          <label className="block mb-2 text-sm font-medium dark:text-gray-300">
            المنطقة
          </label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            disabled={filtersLoading || filters.regions.length === 0}
          >
            {filters.regions.length > 0 ? (
              filters.regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))
            ) : (
              <option value="">
                {filtersLoading ? "جاري التحميل..." : "لا توجد بيانات"}
              </option>
            )}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-end">
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">
              من تاريخ
            </label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex flex-col items-end">
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">
              إلى تاريخ
            </label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* حالة التحميل والخطأ */}
      {filtersLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">جاري تحميل الفلاتر...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong>خطأ!</strong> {error}
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>إغلاق</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}

      {/* المخطط */}
      <div className="relative">
        <div
          className="bg-white dark:bg-customDarkGreenbg p-4 rounded-lg overflow-x-auto"
          ref={chartRef}
        >
          {chartData ? (
            <div className="min-w-[200px] h-[300px]">
              <Bar data={chartData} options={options} />
            </div>
          ) : (
            !loading &&
            !filtersLoading && (
              <div className="text-center py-8 text-gray-500">
                {reportType === "مخالفات" &&
                (!selectedType || !selectedGovernorate || !selectedLocation)
                  ? "الرجاء تحديد جميع الفلاتر المطلوبة"
                  : "لا توجد بيانات متاحة لعرضها. يرجى تحديد الفلاتر والضغط على زر جلب البيانات."}
              </div>
            )
          )}
        </div>
      </div>

      {/* ملخص النتائج */}
      {hourlyData && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          عرض التوزيع الزمني ل{reportType === "حوادث" ? "الحوادث" : "المخالفات"}{" "}
          حسب ساعات اليوم {selectedLocation ? `في ${selectedLocation}` : ""}
        </div>
      )}
    </div>
  );
}

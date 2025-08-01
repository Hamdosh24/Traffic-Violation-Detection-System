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

export default function TrafficViolationsChartByTime() {
  const violationTypes = [
    "سرعة زائدة",
    "إشارة حمراء",
    "عدم ربط حزام الأمان",
    "استخدام الهاتف",
    "تجاوز غير قانوني",
  ];

  const governorates = [
    "دمشق",
    "ريف دمشق",
    "حلب",
    "حمص",
    "حماه",
    "اللاذقية",
    "طرطوس",
    "دير الزور",
    "الحسكة",
    "الرقة",
    "إدلب",
    "السويداء",
    "درعا",
    "القنيطرة",
  ];

  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGovernorate, setSelectedGovernorate] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const chartRef = useRef();
  const componentRef = useRef();

  const availableLocations = useMemo(() => {
    // في التطبيق الحقيقي، يمكن جلب هذه البيانات من API
    return ["all", "دمشق - المنطقة 1", "دمشق - المنطقة 2", "حلب - المنطقة 1"];
  }, []);

  useEffect(() => {
    fetchHourlyViolations();
  }, [selectedType, selectedGovernorate, selectedLocation, startDate, endDate]);

  const fetchHourlyViolations = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        type_name: selectedType,
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
          label: "عدد المخالفات",
          data,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
          borderColor: "rgba(54, 162, 235, 1)",
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
        text: `توزيع المخالفات المرورية حسب ساعات اليوم ${
          selectedLocation !== "all" ? `في ${selectedLocation}` : ""
        }`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.parsed.y} مخالفة`,
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
          text: "عدد المخالفات",
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

    // تحضير البيانات الرئيسية مع الساعات
    const mainData = Object.entries(hourlyData).map(([hourRange, count]) => ({
      "الفترة الزمنية": hourRange.replace("-", ":00 - ") + ":00",
      "عدد المخالفات": count,
      "نوع المخالفة": selectedType === "all" ? "جميع الأنواع" : selectedType,
      المحافظة:
        selectedGovernorate === "all" ? "جميع المحافظات" : selectedGovernorate,
      المنطقة: selectedLocation === "all" ? "جميع المناطق" : selectedLocation,
      التاريخ: `من ${formatDate(startDate)} إلى ${formatDate(endDate)}`,
    }));

    // تحضير قائمة أنواع المخالفات
    const violationTypesData = violationTypes.map((type) => ({
      "نوع المخالفة": type,
      الوصف: getViolationDescription(type),
    }));

    // إنشاء ملف Excel متعدد الأوراق
    const wb = utils.book_new();

    // ورقة البيانات الرئيسية
    const wsMain = utils.json_to_sheet(mainData);
    utils.book_append_sheet(wb, wsMain, "البيانات حسب الساعة");

    // ورقة أنواع المخالفات
    const wsViolations = utils.json_to_sheet(violationTypesData);
    utils.book_append_sheet(wb, wsViolations, "أنواع المخالفات");

    // ورقة ملخص البيانات
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
      ["إجمالي المخالفات", totalViolations],
      ["متوسط المخالفات لكل ساعة", averageViolations.toFixed(2)],
      ["أعلى ساعة في المخالفات", maxHour.hour.replace("-", ":00 - ") + ":00"],
      ["عدد الساعات", Object.keys(hourlyData).length],
    ];

    const wsSummary = utils.aoa_to_sheet(summaryData);
    utils.book_append_sheet(wb, wsSummary, "ملخص البيانات");

    // إضافة تنسيقات للخلايا
    if (!wb.SSF) {
      wb.SSF = {};
    }
    wb.SSF["#,##0"] = "#,##0";

    // تعيين عرض الأعمدة
    wsMain["!cols"] = [
      { wch: 15 }, // عرض عمود الفترة الزمنية
      { wch: 15 }, // عدد المخالفات
      { wch: 20 }, // نوع المخالفة
      { wch: 15 }, // المحافظة
      { wch: 25 }, // المنطقة
      { wch: 25 }, // التاريخ
    ];

    // تصدير الملف
    writeFile(
      wb,
      `تقرير_المخالفات_حسب_الساعة_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // دالة مساعدة لوصف أنواع المخالفات
  const getViolationDescription = (type) => {
    const descriptions = {
      "سرعة زائدة": "تجاوز السرعة المحددة حسب القانون",
      "إشارة حمراء": "عدم التوقف عند الإشارة الضوئية الحمراء",
      "عدم ربط حزام الأمان": "عدم استخدام حزام الأمان أثناء القيادة",
      "استخدام الهاتف": "استخدام الهاتف المحمول أثناء القيادة بدون سماعات",
      "تجاوز غير قانوني": "تجاوز المركبات في أماكن غير مسموح بها",
    };
    return descriptions[type] || "لا يوجد وصف متاح";
  };

  // طباعة التقرير
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
    <div className="bg-milkColor dark:bg-customDarkGreen p-6 rounded-md shadow-xl">
      {/* Reference for printing */}
      <div className="hidden">
        <div ref={componentRef} className="p-6">
          <div className="print-header">
            <h1 className="text-2xl font-bold">تقرير المخالفات المرورية</h1>
            <p className="text-gray-600">
              تاريخ التقرير: {new Date().toLocaleDateString("ar-EG")}
            </p>
          </div>

          <div className="print-filters">
            <div className="print-filter-item">
              <strong>نوع المخالفة: </strong>
              {selectedType === "all" ? "جميع الأنواع" : selectedType}
            </div>
            <div className="print-filter-item">
              <strong>المحافظة: </strong>
              {selectedGovernorate === "all"
                ? "جميع المحافظات"
                : selectedGovernorate}
            </div>
            <div className="print-filter-item">
              <strong>المنطقة: </strong>
              {selectedLocation === "all" ? "جميع المناطق" : selectedLocation}
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
                  <th>عدد المخالفات</th>
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

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            disabled={!hourlyData}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1 disabled:opacity-50"
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
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50"
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
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">
          توزيع عدد المخالفات المرورية حسب ساعات اليوم
        </h2>
      </div>

      {/* فلترات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block mb-2 text-sm font-medium dark:text-gray-300">
            نوع المخالفة
          </label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">كل الأنواع</option>
            {violationTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium dark:text-gray-300">
            المحافظة
          </label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedGovernorate}
            onChange={(e) => {
              setSelectedGovernorate(e.target.value);
              setSelectedLocation("all");
            }}
          >
            <option value="all">كل المحافظات</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium dark:text-gray-300">
            المنطقة
          </label>
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            disabled={availableLocations.length <= 1}
          >
            <option value="all">كل المناطق</option>
            {availableLocations
              .filter((loc) => loc !== "all")
              .map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
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

        <div>
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

      {/* حالة التحميل والخطأ */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">جاري تحميل البيانات...</p>
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
            !loading && (
              <div className="text-center py-8 text-gray-500">
                لا توجد بيانات متاحة لعرضها
              </div>
            )
          )}
        </div>
      </div>

      {/* ملخص النتائج */}
      {hourlyData && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          عرض التوزيع الزمني للمخالفات حسب ساعات اليوم{" "}
          {selectedLocation !== "all" ? `في ${selectedLocation}` : ""}
        </div>
      )}
    </div>
  );
}

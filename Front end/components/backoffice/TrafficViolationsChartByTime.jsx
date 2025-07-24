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

  // إنشاء بيانات وهمية لـ 150 منطقة مع المحافظات
  const generateMockData = useMemo(() => {
    const mockData = [];

    governorates.forEach((governorate) => {
      const locationsInGovernorate = Math.floor(Math.random() * 15) + 5;

      for (let i = 1; i <= locationsInGovernorate; i++) {
        const location = `${governorate} - المنطقة ${i}`;

        violationTypes.forEach((type) => {
          // توزيع المخالفات على أشهر السنة وساعات اليوم
          for (let month = 0; month < 12; month++) {
            for (let hour = 0; hour < 24; hour++) {
              mockData.push({
                governorate,
                location,
                type,
                date: new Date(2023, month, 1, hour), // إضافة ساعة اليوم
                hour, // تخزين ساعة اليوم كحقل منفصل
                count: Math.floor(Math.random() * 10) + 1, // 1-10 مخالفة لكل نوع في كل ساعة
              });
            }
          }
        });
      }
    });

    return mockData;
  }, []);

  const [filteredData, setFilteredData] = useState([]);
  const [selectedType, setSelectedType] = useState("كل الأنواع");
  const [selectedGovernorate, setSelectedGovernorate] = useState("دمشق");
  const [selectedLocation, setSelectedLocation] = useState("كل المناطق");
  const [startDate, setStartDate] = useState(new Date(2023, 0, 1));
  const [endDate, setEndDate] = useState(new Date(2023, 11, 31));
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("time"); // 'locations' or 'time'
  const itemsPerPage = 30;
  const chartRef = useRef();
  const componentRef = useRef();

  // استخراج المناطق المتاحة بناءً على المحافظة المحددة
  const availableLocations = useMemo(() => {
    const locations = new Set();
    generateMockData.forEach((item) => {
      if (
        selectedGovernorate === "كل المحافظات" ||
        item.governorate === selectedGovernorate
      ) {
        locations.add(item.location);
      }
    });
    return ["كل المناطق", ...Array.from(locations)];
  }, [generateMockData, selectedGovernorate]);

  useEffect(() => {
    const filtered = generateMockData.filter((item) => {
      const typeMatch =
        selectedType === "كل الأنواع" || item.type === selectedType;
      const governorateMatch = item.governorate === selectedGovernorate; // إزالة التحقق من "كل المحافظات"
      const locationMatch =
        selectedLocation === "كل المناطق" || item.location === selectedLocation;
      const dateMatch = item.date >= startDate && item.date <= endDate;

      return typeMatch && governorateMatch && locationMatch && dateMatch;
    });

    setFilteredData(filtered);
    setCurrentPage(0);
  }, [
    generateMockData,
    selectedType,
    selectedGovernorate,
    selectedLocation,
    startDate,
    endDate,
  ]);

  // تجميع البيانات حسب الوقت
  const aggregatedData = useMemo(() => {
    if (viewMode === "locations" && selectedLocation === "كل المناطق") {
      // تجميع حسب الموقع (يبقى كما هو)
      const aggregation = {};
      filteredData.forEach((item) => {
        if (!aggregation[item.location]) {
          aggregation[item.location] = 0;
        }
        aggregation[item.location] += item.count;
      });
      const sorted = Object.entries(aggregation)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count);
      return {
        type: "locations",
        allData: sorted,
        paginatedData: sorted.slice(
          currentPage * itemsPerPage,
          (currentPage + 1) * itemsPerPage
        ),
        totalPages: Math.ceil(sorted.length / itemsPerPage),
      };
    } else {
      // تجميع حسب ساعات اليوم
      const hourlyData = Array(24)
        .fill(0)
        .map((_, hour) => ({
          hour,
          hourLabel: `${hour}:00 - ${hour + 1}:00`, // تسمية لكل ساعة
          count: 0,
        }));

      filteredData.forEach((item) => {
        hourlyData[item.hour].count += item.count;
      });

      return {
        type: "time",
        allData: hourlyData,
        paginatedData: hourlyData,
        totalPages: 1,
      };
    }
  }, [filteredData, currentPage, viewMode, selectedLocation]);

  const chartData = {
    labels: aggregatedData.paginatedData.map((item) =>
      aggregatedData.type === "locations" ? item.location : item.hourLabel
    ),
    datasets: [
      {
        label: "عدد المخالفات",
        data: aggregatedData.paginatedData.map((item) => item.count),
        backgroundColor:
          aggregatedData.type === "locations"
            ? "rgb(13, 158, 109)"
            : "rgba(54, 162, 235, 0.7)",
        borderColor:
          aggregatedData.type === "locations"
            ? "rgb(13, 158, 109, 0.7)"
            : "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `توزيع المخالفات المرورية حسب ساعات اليوم ${
          selectedLocation !== "كل المناطق" ? `في ${selectedLocation}` : ""
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
    // تحضير البيانات الرئيسية مع الساعات
    const mainData = aggregatedData.allData.map((item) => ({
      "الفترة الزمنية": item.hourLabel || item.monthName, // استخدام hourLabel إذا كان موجوداً
      "عدد المخالفات": item.count,
      "نوع المخالفة":
        selectedType === "كل الأنواع" ? "جميع الأنواع" : selectedType,
      المحافظة: selectedGovernorate,
      المنطقة: selectedLocation,
      التاريخ: `من ${startDate.toLocaleDateString(
        "ar-EG"
      )} إلى ${endDate.toLocaleDateString("ar-EG")}`,
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
    const summaryData = [
      [
        "إجمالي المخالفات",
        aggregatedData.allData.reduce((sum, item) => sum + item.count, 0),
      ],
      [
        "متوسط المخالفات لكل ساعة",
        (
          aggregatedData.allData.reduce((sum, item) => sum + item.count, 0) /
          aggregatedData.allData.length
        ).toFixed(2),
      ],
      [
        "أعلى ساعة في المخالفات",
        aggregatedData.allData.reduce(
          (max, item) => (item.count > max.count ? item : max),
          aggregatedData.allData[0]
        ).hourLabel,
      ],
      ["عدد الساعات", aggregatedData.allData.length],
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
              {selectedType}
            </div>
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
              من {startDate.toLocaleDateString("ar-EG")} إلى{" "}
              {endDate.toLocaleDateString("ar-EG")}
            </div>
          </div>

          <div className="print-chart-container">
            <Bar data={chartData} options={options} />
          </div>

          <table className="print-data-table">
            <thead>
              <tr>
                <th>
                  {aggregatedData.type === "locations" ? "المنطقة" : "الشهر"}
                </th>
                <th>عدد المخالفات</th>
              </tr>
            </thead>
            <tbody>
              {aggregatedData.allData.map((item) => (
                <tr
                  key={
                    aggregatedData.type === "locations"
                      ? item.location
                      : item.monthName
                  }
                >
                  <td>
                    {aggregatedData.type === "locations"
                      ? item.location
                      : item.monthName}
                  </td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
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
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
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
            <option value="كل الأنواع">كل الأنواع</option>
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
              setSelectedLocation("كل المناطق");
            }}
          >
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
            onChange={(e) => {
              setSelectedLocation(e.target.value);
              setViewMode(
                e.target.value === "كل المناطق" ? "locations" : "time"
              );
            }}
            disabled={availableLocations.length <= 1}
          >
            {availableLocations.map((loc) => (
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

      {/* المخطط مع التمرير */}
      <div className="relative">
        <div
          className="bg-white dark:bg-customDarkGreenbg p-4 rounded-lg overflow-x-auto"
          ref={chartRef}
        >
          <div className="min-w-[200px] h-[300px]">
            <Bar data={chartData} options={options} />
          </div>
        </div>

        {/* تنقل بين الصفحات */}
        {aggregatedData.type === "locations" &&
          aggregatedData.totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                disabled={currentPage === 0}
                className="px-4 py-2 mx-1 bg-gray-200 text-black rounded disabled:opacity-50"
              >
                السابق
              </button>

              {Array.from(
                { length: Math.min(5, aggregatedData.totalPages) },
                (_, i) => {
                  const page =
                    currentPage < 3
                      ? i
                      : currentPage > aggregatedData.totalPages - 4
                      ? aggregatedData.totalPages - 5 + i
                      : currentPage - 2 + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 mx-1 rounded ${
                        currentPage === page
                          ? "bg-customGreen text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {page + 1}
                    </button>
                  );
                }
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, aggregatedData.totalPages - 1)
                  )
                }
                disabled={currentPage === aggregatedData.totalPages - 1}
                className="px-4 py-2 mx-1 bg-gray-200 text-black rounded disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          )}
      </div>

      {/* ملخص النتائج */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        {aggregatedData.type === "locations" ? (
          <>
            عرض المناطق من {currentPage * itemsPerPage + 1} إلى{" "}
            {Math.min(
              (currentPage + 1) * itemsPerPage,
              aggregatedData.allData.length
            )}{" "}
            من أصل {aggregatedData.allData.length} منطقة
          </>
        ) : (
          <>
            عرض التوزيع الزمني للمخالفات حسب ساعات اليوم{" "}
            {selectedLocation !== "كل المناطق" ? `في ${selectedLocation}` : ""}
          </>
        )}
      </div>
    </div>
  );
}

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

export default function TrafficViolationsChart() {
  const violationTypes = [
    "سرعة زائدة",
    "إشارة حمراء",
    "عدم ربط حزام الأمان",
    "استخدام الهاتف",
    "تجاوز غير قانوني",
  ];

  // إنشاء بيانات وهمية لـ 150 منطقة
  const generateMockData = useMemo(() => {
    const locations = Array.from({ length: 150 }, (_, i) => `المنطقة ${i + 1}`);
    const mockData = [];

    locations.forEach((location) => {
      violationTypes.forEach((type) => {
        mockData.push({
          location,
          type,
          date: new Date(2023, Math.floor(Math.random() * 12)),
          count: Math.floor(Math.random() * 100) + 10,
        });
      });
    });

    return mockData;
  }, []);

  const [filteredData, setFilteredData] = useState([]);
  const [selectedType, setSelectedType] = useState("كل الأنواع");
  const [startDate, setStartDate] = useState(new Date(2023, 0, 1));
  const [endDate, setEndDate] = useState(new Date(2023, 11, 31));
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 30;
  const componentRef = useRef();

  useEffect(() => {
    const filtered = generateMockData.filter((item) => {
      const typeMatch =
        selectedType === "كل الأنواع" || item.type === selectedType;
      const dateMatch = item.date >= startDate && item.date <= endDate;
      return typeMatch && dateMatch;
    });

    setFilteredData(filtered);
    setCurrentPage(0);
  }, [generateMockData, selectedType, startDate, endDate]);

  // تجميع البيانات حسب الموقع مع التقسيم للصفحات
  const aggregateDataByLocation = useMemo(() => {
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
      allData: sorted,
      paginatedData: sorted.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      ),
      totalPages: Math.ceil(sorted.length / itemsPerPage),
    };
  }, [filteredData, currentPage]);

  const chartData = {
    labels: aggregateDataByLocation.paginatedData.map((item) => item.location),
    datasets: [
      {
        label: "عدد المخالفات",
        data: aggregateDataByLocation.paginatedData.map((item) => item.count),
        backgroundColor: "rgb(13, 158, 109)",
        borderColor: "rgb(13, 158, 109,7)",
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
        text: "توزيع المخالفات المرورية حسب المنطقة",
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
          maxRotation: 90,
          minRotation: 90,
          font: {
            size: 8,
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
          stepSize: 20,
        },
      },
    },
    maintainAspectRatio: false,
    barPercentage: 0.8,
    categoryPercentage: 0.9,
  };

  // تصدير إلى Excel مع تحسينات
  const exportToExcel = () => {
    try {
      // 1. تحضير البيانات الرئيسية
      const mainData = aggregateDataByLocation.allData.map((item) => ({
        المنطقة: item.location,
        "عدد المخالفات": item.count,
        "نوع المخالفة":
          selectedType === "كل الأنواع" ? "جميع الأنواع" : selectedType,
        "الفترة الزمنية": `من ${startDate.toLocaleDateString(
          "ar-EG"
        )} إلى ${endDate.toLocaleDateString("ar-EG")}`,
      }));

      // 2. تحضير قائمة أنواع المخالفات
      const violationTypesData = violationTypes.map((type) => ({
        "نوع المخالفة": type,
        الوصف: getViolationDescription(type),
      }));

      // 3. إنشاء ملف Excel متعدد الأوراق
      const wb = utils.book_new();

      // أ. ورقة البيانات الرئيسية
      const wsMain = utils.json_to_sheet(mainData);
      utils.book_append_sheet(wb, wsMain, "البيانات");

      // ب. ورقة أنواع المخالفات
      const wsViolations = utils.json_to_sheet(violationTypesData);
      utils.book_append_sheet(wb, wsViolations, "أنواع المخالفات");

      // ج. ورقة الملخص
      const totalViolations = aggregateDataByLocation.allData.reduce(
        (sum, item) => sum + item.count,
        0
      );
      const averageViolations = (
        totalViolations / aggregateDataByLocation.allData.length
      ).toFixed(2);

      const summaryData = [
        ["إجمالي عدد المخالفات", totalViolations],
        ["متوسط المخالفات لكل منطقة", averageViolations],
        [
          "أعلى منطقة في المخالفات",
          aggregateDataByLocation.allData[0]?.location || "غير متاح",
        ],
        ["عدد المناطق المدرجة", aggregateDataByLocation.allData.length],
        ["تاريخ التقرير", new Date().toLocaleDateString("ar-EG")],
      ];

      const wsSummary = utils.aoa_to_sheet(summaryData);
      utils.book_append_sheet(wb, wsSummary, "ملخص");

      // 4. تنسيق الأعمدة
      const setColumnWidths = (ws, widths) => {
        ws["!cols"] = widths.map((w) => ({ width: w }));
      };

      setColumnWidths(wsMain, [25, 15, 20, 30]);
      setColumnWidths(wsViolations, [20, 30]);
      setColumnWidths(wsSummary, [25, 20]);

      // 5. تصدير الملف
      writeFile(
        wb,
        `تقرير_المخالفات_${new Date().toISOString().slice(0, 10)}.xlsx`,
        { bookType: "xlsx", type: "array" }
      );
    } catch (error) {
      console.error("حدث خطأ أثناء التصدير:", error);
      alert("حدث خطأ أثناء إنشاء ملف Excel. يرجى المحاولة مرة أخرى.");
    }
  };

  // دالة مساعدة لوصف أنواع المخالفات
  const getViolationDescription = (type) => {
    const descriptions = {
      "سرعة زائدة": "تجاوز السرعة القانونية المحددة",
      "إشارة حمراء": "عدم التوقف عند إشارة المرور الحمراء",
      "عدم ربط حزام الأمان": "عدم استخدام حزام الأمان أثناء القيادة",
      "استخدام الهاتف": "استخدام الهاتف المحمول يدوياً أثناء القيادة",
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
                <th>المنطقة</th>
                <th>عدد المخالفات</th>
              </tr>
            </thead>
            <tbody>
              {aggregateDataByLocation.allData.map((item) => (
                <tr key={item.location}>
                  <td>{item.location}</td>
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
          توزيع لعدد المخالفات المرورية في المناطق حسب الزمن
        </h2>
      </div>

      {/* فلترات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        <div className="bg-white dark:bg-customDarkGreenbg p-4 rounded-lg overflow-x-auto">
          <div className="min-w-[200px] h-[300px]">
            <Bar data={chartData} options={options} />
          </div>
        </div>

        {/* تنقل بين الصفحات */}
        {aggregateDataByLocation.totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="px-4 py-2 mx-1 bg-gray-200 text-black rounded disabled:opacity-50"
            >
              السابق
            </button>

            {Array.from(
              { length: Math.min(5, aggregateDataByLocation.totalPages) },
              (_, i) => {
                const page =
                  currentPage < 3
                    ? i
                    : currentPage > aggregateDataByLocation.totalPages - 4
                    ? aggregateDataByLocation.totalPages - 5 + i
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
                  Math.min(p + 1, aggregateDataByLocation.totalPages - 1)
                )
              }
              disabled={currentPage === aggregateDataByLocation.totalPages - 1}
              className="px-4 py-2 mx-1 bg-gray-200 text-black rounded disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )}
      </div>

      {/* ملخص النتائج */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        عرض المناطق من {currentPage * itemsPerPage + 1} إلى{" "}
        {Math.min(
          (currentPage + 1) * itemsPerPage,
          aggregateDataByLocation.allData.length
        )}{" "}
        من أصل {aggregateDataByLocation.allData.length} منطقة
      </div>
    </div>
  );
}

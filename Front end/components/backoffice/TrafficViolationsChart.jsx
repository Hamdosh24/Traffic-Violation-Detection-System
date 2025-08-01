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
  const [selectedType, setSelectedType] = useState("all");
  const [startDate, setStartDate] = useState(new Date(2025, 0, 1));
  const [endDate, setEndDate] = useState(new Date(2025, 6, 24));
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 30;
  const componentRef = useRef();

  const violationTypes = [
    { value: "all", label: "كل الأنواع" },
    { value: "speeding", label: "سرعة زائدة" },
    { value: "red_light", label: "إشارة حمراء" },
    { value: "seatbelt", label: "عدم ربط حزام الأمان" },
    { value: "phone", label: "استخدام الهاتف" },
    { value: "illegal_overtaking", label: "تجاوز غير قانوني" },
  ];

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchViolationData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { success, data, error } =
        await StandardApi.fetchViolationsByRegion({
          type_name: selectedType,
          from_date: formatDate(startDate),
          to_date: formatDate(endDate),
        });

      if (!success) {
        throw new Error(error || "فشل في جلب بيانات المخالفات");
      }

      setViolationData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
      console.error("تفاصيل الخطأ:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchViolationData();
  }, [selectedType, startDate, endDate]);

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
          backgroundColor: "rgb(13, 158, 109)",
          borderColor: "rgba(13, 158, 109, 0.7)",
          borderWidth: 1,
        },
      ],
    }),
    [paginatedData]
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "توزيع المخالفات المرورية حسب المنطقة",
        font: { size: 16 },
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
          font: { size: 8 },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "عدد المخالفات",
          font: { size: 12 },
        },
        ticks: { stepSize: 20 },
      },
    },
    maintainAspectRatio: false,
    barPercentage: 0.8,
    categoryPercentage: 0.9,
  };

  const exportToExcel = () => {
    try {
      const ws = utils.json_to_sheet(
        allData.map((item) => ({
          المنطقة: item.region,
          "عدد المخالفات": item.count,
          "نوع المخالفة":
            violationTypes.find((t) => t.value === selectedType)?.label ||
            "كل الأنواع",
          "الفترة الزمنية": `من ${startDate.toLocaleDateString(
            "ar-EG"
          )} إلى ${endDate.toLocaleDateString("ar-EG")}`,
        }))
      );

      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "المخالفات");
      writeFile(
        wb,
        `تقرير_المخالفات_${new Date().toISOString().slice(0, 10)}.xlsx`
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
      body { direction: rtl; }
      .print-header { text-align: center; margin-bottom: 20px; }
      .print-table { width: 100%; border-collapse: collapse; }
      .print-table th, .print-table td { border: 1px solid #ddd; padding: 8px; }
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
          onClick={fetchViolationData}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {/* Hidden Print Content */}
      <div className="hidden">
        <div ref={componentRef} className="p-4">
          <h1 className="print-header text-xl font-bold">
            تقرير المخالفات المرورية
          </h1>
          <table className="print-table">
            <thead>
              <tr>
                <th>المنطقة</th>
                <th>عدد المخالفات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          إحصائيات المخالفات المرورية
        </h2>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <span>تصدير Excel</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            نوع المخالفة
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
          >
            {violationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            من تاريخ
          </label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            إلى تاريخ
          </label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
        <div className="h-80">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            الصفحة {currentPage + 1} من {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
            >
              السابق
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page =
                currentPage < 3
                  ? i
                  : currentPage > totalPages - 3
                  ? totalPages - 5 + i
                  : currentPage - 2 + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
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
              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

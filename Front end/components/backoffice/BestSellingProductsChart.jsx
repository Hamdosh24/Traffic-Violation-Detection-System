"use client";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BestSellingProductsChart() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  // دالة لجلب البيانات من API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          "http://127.0.0.1:8000/api/dashboard/donut_chart",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setApiData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // بيانات افتراضية فارغة للحفاظ على الحجم
  const emptyData = {
    labels: ["", "", "", "", ""],
    datasets: [
      {
        label: "# of Votes",
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0)",
          "rgba(54, 162, 235, 0)",
          "rgba(165, 122, 172, 0)",
          "rgba(255, 206, 86, 0)",
          "rgba(75, 192, 192, 0)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 0)",
          "rgba(54, 162, 235, 0)",
          "rgba(165, 122, 172, 0)",
          "rgba(255, 206, 86, 0)",
          "rgba(75, 192, 192, 0)",
        ],
        borderWidth: 0,
      },
    ],
  };

  // تحضير البيانات للعرض
  const chartData = apiData
    ? {
        labels: apiData.map((item) => item.type),
        datasets: [
          {
            label: "النسبة المئوية",
            data: apiData.map((item) => item.percentage),
            backgroundColor: [
              "rgba(255, 99, 132, 0.35)",
              "rgba(54, 162, 235, 0.35)",
              "rgba(165, 122, 172, 0.35)",
              "rgba(255, 206, 86, 0.35)",
              "rgba(75, 192, 192, 0.35)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(165, 122, 172, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : emptyData;

  // خيارات المخطط للحفاظ على الشكل
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    radius: "100%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 25,
          padding: 15,
          font: {
            size: 15,
            family: "'Cairo', sans-serif", // إضافة نوع الخط إذا أردت
            weight: "bold",
          },
        },
      },
    },
  };

  return (
    <div className="bg-milkColor/90 dark:bg-customDarkGreen p-8 rounded-md shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50">
        نسبة عدد المخالفات المرورية خلال 30 يوم
      </h2>
      <div className="p-4 h-80">
        <Pie
          data={chartData}
          options={options}
          redraw={!loading} // إعادة الرسم فقط عند توفر البيانات
        />
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { StandardApi } from "@/app/api/StandarApi";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonatChart() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await StandardApi.get("/dashboard/donut_chart");
        if (response.success) {
          setApiData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    : null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 25,
          padding: 15,
          font: {
            size: 15,
            family: "'Cairo', sans-serif",
            weight: "bold",
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-milkColor/90 dark:bg-customDarkGreen p-8 rounded-md shadow-xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
          <div className="p-4 h-80 flex items-center justify-center">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-48 w-48"></div>
            <div className="ml-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded-full mr-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-milkColor/90 dark:bg-customDarkGreen p-8 rounded-md shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50">
        نسبة عدد المخالفات المرورية خلال 30 يوم
      </h2>
      <div className="p-4 h-80">
        <Pie
          data={
            chartData || {
              labels: [],
              datasets: [
                {
                  data: [],
                  backgroundColor: [],
                  borderColor: [],
                },
              ],
            }
          }
          options={options}
        />
      </div>
    </div>
  );
}

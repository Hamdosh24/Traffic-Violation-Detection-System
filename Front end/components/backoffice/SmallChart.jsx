"use client";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { StandardApi } from "@/app/api/StandarApi";

export default function SmallChart() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const [loading, setLoading] = useState(true);
  const [violationsData, setViolationsData] = useState([]);
  const [accidentsData, setAccidentsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // جلب بيانات المخالفات
        const violationsResponse = await StandardApi.get(
          "/dashboard/line_chart"
        );
        if (violationsResponse.success) {
          setViolationsData(violationsResponse.data);
        }

        // جلب بيانات الحوادث
        const accidentsResponse = await StandardApi.get(
          "/dashboard/line_chart2"
        );
        if (accidentsResponse.success) {
          setAccidentsData(accidentsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "تغير عدد المخالفات والحوادث عبر الزمن",
      },
    },
    elements: {
      line: {
        tension: 0.2,
      },
    },
  };

  const tabs = [
    {
      title: "المخالفات",
      type: "violations",
      data: {
        labels: violationsData.map((item) => item.date),
        datasets: [
          {
            label: "عدد المخالفات",
            data: violationsData.map((item) => item.total),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      },
      color: "rgb(255, 99, 132,20)",
    },
    {
      title: "الحوادث",
      type: "accidents",
      data: {
        labels: accidentsData.map((item) => item.date),
        datasets: [
          {
            label: "عدد الحوادث",
            data: accidentsData.map((item) => item.total),
            borderColor: "rgb(0, 137, 132)",
            backgroundColor: "rgba(0, 137, 132, 0.8)",
          },
        ],
      },
      color: "rgb(0, 137, 132,20)",
    },
  ];

  const [chartToDisplay, setChartToDisplay] = useState(tabs[0].type);

  if (loading) {
    return (
      <div className="bg-milkColor dark:bg-customDarkGreen p-8 rounded-md shadow-xl py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-6"></div>

          <div className="flex space-x-4 mb-6">
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg h-64">
            <div className="h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-milkColor dark:bg-customDarkGreen p-8 rounded-md shadow-xl py-8">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50">
        تغير عدد المخالفات والحوادث عبر الزمن
      </h2>
      <div className="p-4">
        {/* Tabs  */}
        <div className="text-sm font-medium text-center text-gray-200 border-b border-gray-400 dark:text-gray-400 dark:border-gray-500">
          <ul className="flex flex-wrap -mb-px">
            {tabs.map((tab, i) => {
              return (
                <li
                  key={i}
                  onClick={() => setChartToDisplay(tab.type)}
                  className="me-2"
                >
                  <button
                    className={
                      chartToDisplay == tab.type
                        ? `inline-block p-4 text-white border-b-2 rounded-t-lg`
                        : `inline-block p-4 border-b-2 border-transparent rounded-t-lg text-gray-300 border-gray-300 dark:text-slate-500 dark:border-slate-500  hover:text-gray-600 hover:border-gray-600 dark:hover:border-gray-100 dark:hover:text-gray-100`
                    }
                    style={{
                      color: chartToDisplay === tab.type ? tab.color : "",
                      borderColor: chartToDisplay === tab.type ? tab.color : "",
                    }}
                  >
                    {tab.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Content to display */}
        {tabs.map((tab, i) => {
          if (chartToDisplay == tab.type) {
            return <Line key={i} options={options} data={tab.data} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}

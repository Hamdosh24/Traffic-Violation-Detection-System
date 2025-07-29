"use client";
import React, { useState } from "react";
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
import faker from "faker";

export default function WeeklySalesChart() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
    elements: {
      line: {
        tension: 0.2, // يجعل الخط أكثر انحناءً (اختياري)
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const tabs = [
    {
      title: "Sales",
      type: "sales",
      data: {
        labels,
        datasets: [
          {
            label: "Sales",
            data: labels.map(() =>
              // TODO
              faker.datatype.number({ min: -1000, max: 1000 })
            ),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      },
      color: "rgb(255, 99, 132,20)",
    },
    {
      title: "Orders",
      type: "orders",
      data: {
        labels,
        datasets: [
          {
            label: "Orders",
            data: labels.map(() =>
              faker.datatype.number({ min: -1000, max: 1000 })
            ),
            borderColor: "rgb(0, 137, 132)",
            backgroundColor: "rgba(0, 137, 132, 0.8)",
          },
        ],
      },
      color: "rgb(0, 137, 132,20)",
    },
  ];

  const [chartTodDisplay, setChartTodDisplay] = useState(tabs[0].type);
  return (
    <div className="bg-milkColor dark:bg-customDarkGreen p-8 rounded-md shadow-xl py-8">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50">
        Weekly Sales
      </h2>
      <div className="p-4">
        {/* Tabs  */}

        <div className="text-sm font-medium text-center text-gray-200 border-b border-gray-400 dark:text-gray-400 dark:border-gray-500">
          <ul className="flex flex-wrap -mb-px">
            {tabs.map((tab, i) => {
              return (
                <li
                  key={i}
                  onClick={() => setChartTodDisplay(tab.type)}
                  className="me-2"
                >
                  <button
                    className={
                      chartTodDisplay == tab.type
                        ? `inline-block p-4 text-white border-b-2 rounded-t-lg`
                        : `inline-block p-4 border-b-2 border-transparent rounded-t-lg text-gray-300 border-gray-300 dark:text-slate-500 dark:border-slate-500  hover:text-gray-600 hover:border-gray-600 dark:hover:border-gray-100 dark:hover:text-gray-100`
                    }
                    style={{
                      color: chartTodDisplay === tab.type ? tab.color : "",
                      borderColor:
                        chartTodDisplay === tab.type ? tab.color : "",
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
          if (chartTodDisplay == tab.type) {
            return <Line key={i} options={options} data={tab.data} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BestSellingProductsChart() {
  const data = {
    labels: [
      "Cabbage Cabbage Cabbage ",
      "Watermelon Cabbage Cabbage",
      "Broccoli Cabbage Cabbage",
      "Maize Cabbage Cabbage ",
      "Maize Cabbage Cabbage ",
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [30, 10, 30, 20, 10],
        backgroundColor: [
          "rgba(255, 99, 132, 0.35)",
          "rgba(54, 162, 235, 0.35)",
          "rgba(165, 122, 172, 0.35)",
          "rgba(255, 206, 86, 0.35)",
          "rgba(75, 192, 192, 0.35)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 2)",
          "rgba(54, 162, 235, 2)",
          "rgba(165, 122, 172, 2)",
          "rgba(255, 206, 86, 2)",
          "rgba(75, 192, 192, 2)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="bg-milkColor/90 dark:bg-customDarkGreen p-8 rounded-md shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50">
        Best Selling Charts
      </h2>
      {/* Charts  */}
      <div className="p-4">
        <Pie data={data} />
      </div>
    </div>
  );
}

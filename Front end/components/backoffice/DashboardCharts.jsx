import React from "react";
import SmallChart from "./SmallChart";
import BestSellingProductsChart from "./BestSellingProductsChart";

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-8">
      <SmallChart />
      <BestSellingProductsChart />
    </div>
  );
}

import React from "react";
import Heading from "@/components/backoffice/Heading";
import LargeCards from "@/components/backoffice/LargeCards";
import SmallCards from "@/components/backoffice/SmallCards";
import DashboardCharts from "@/components/backoffice/DashboardCharts";

export default function page() {
  return (
    <div>
      <Heading title="Employee Dashboard Overview" />
      {/* Large Cards  */}
      <LargeCards />
      {/* Small Cards  */}
      <SmallCards />
      {/* Charts  */}
      <DashboardCharts />
    </div>
  );
}

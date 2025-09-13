import SmallChart from "./SmallChart";
import DonatChart from "./DonatChart";

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 py-8">
      <SmallChart />
      <DonatChart />
    </div>
  );
}

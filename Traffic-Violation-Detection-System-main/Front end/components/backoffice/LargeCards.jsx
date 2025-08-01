import React from "react";
import LargeCard from "./LargeCard";

export default function LargeCards() {
  const orderState = [
    {
      period: "Today Orders",
      sales: 110000,
      color: "bg-customGreen",
    },
    {
      period: "Yesterday Orders",
      sales: 130000,
      color: "bg-customGreen",
    },
    {
      period: "This Month",
      sales: 3000000,
      color: "bg-customGreen",
    },
    {
      period: "All Time Sales",
      sales: 5000000,
      color: "bg-customGreen",
    },
    {
      period: "Today Orders",
      sales: 110000,
      color: "bg-customGreen",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-8">
      {/* Card  */}
      {orderState.map((item, i) => {
        return <LargeCard key={i} data={item} />;
      })}
    </div>
  );
}

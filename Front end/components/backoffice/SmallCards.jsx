import React from "react";
import SmallCard from "./SmallCard";
import { CheckCheck, Loader2, RefreshCcw, ShoppingCart } from "lucide-react";

export default function SmallCards() {
  const OrderStatus = [
    {
      title: "Total Order",
      number: 150,
      iconBg: "bg-iconGold",
      icon: ShoppingCart,
    },
    {
      title: "Orders Pending",
      number: 100,
      iconBg: "bg-iconGold",
      icon: Loader2,
    },
    {
      title: "Order Processing",
      number: 200,
      iconBg: "bg-iconGold",
      icon: RefreshCcw,
    },
    {
      title: "Orders Deliverd ",
      number: 300,
      iconBg: "bg-iconGold",
      icon: CheckCheck,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-8">
      {/* Card  */}
      {OrderStatus.map((data, i) => {
        return <SmallCard data={data} key={i} />;
      })}
    </div>
  );
}

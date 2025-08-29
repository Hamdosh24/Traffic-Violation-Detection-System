import React from "react";

export default function SmallCard({ data }) {
  const { title, text, number, iconBg, icon: Icon } = data;
  return (
    <div className="rounded-md shadow-xl bg-milkColor/90 dark:bg-customDarkGreen/90 p-4 dark:text-slate-50 text-slate-800 w-full">
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
        <div
          className={`w-12 h-12 ${iconBg} rounded-full items-center flex justify-center mx-auto sm:mx-0`}
        >
          <Icon className="text-slate-50 dark:text-slate-50 w-6 h-6" />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm font-bold sm:text-base">{title}</p>
          <h3 className="text-xl sm:text-2xl">{number}</h3>
          <h3 className="text-md ">{text}</h3>
        </div>
      </div>
    </div>
  );
}

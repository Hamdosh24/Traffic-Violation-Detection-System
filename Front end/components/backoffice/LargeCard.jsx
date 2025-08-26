import { AlertTriangle, Car, ChevronRight, Skull } from "lucide-react";
import React from "react";

const colorVariants = {
  1: "bg-gradient-to-br from-emerald-700 to-emerald-800 hover:shadow-emerald-500/10",
  2: "bg-gradient-to-br from-teal-600 to-teal-700 hover:shadow-teal-500/10",
  3: "bg-gradient-to-br from-green-500 to-green-600 hover:shadow-green-500/10",
  4: "bg-gradient-to-br from-lime-500 to-lime-600 hover:shadow-lime-500/10",
};

export default function LargeCard({ data }) {
  return (
    <div
      className={`relative rounded-xl text-white shadow-lg duration-200 p-6 flex flex-col h-full group ${
        colorVariants[data.rank] ||
        "bg-gradient-to-br from-gray-600 to-gray-700"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center transition-transform hover:scale-105">
            <Car className="w-4 h-4 text-white" />
            <AlertTriangle className="absolute -top-1 -right-1 w-3 h-3 text-red-400 bg-white rounded-full p-0.5" />
          </div>
          <h3 className="text-lg font-bold line-clamp-1 hover:text-white/90 transition-colors">
            {data.streetName}
          </h3>
        </div>
        <span className="bg-white/20 text-xs font-bold px-2 py-1 rounded-full hover:bg-white/30 transition-colors">
          #{data.rank}
        </span>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-90 hover:opacity-100 transition-opacity">
            الموقع
          </span>
          <span className="text-sm font-medium flex items-center hover:text-white/90">
            {data.location}
            <ChevronRight className="w-4 h-4 mr-1 hover:translate-x-0.5 transition-transform" />
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-white/20 pt-3">
          <span className="text-sm opacity-90 hover:opacity-100 transition-opacity">
            عدد الحوادث
          </span>
          <div className="flex items-center gap-1">
            <Skull className="w-4 h-4 text-white/80 hover:text-red-400 transition-colors" />
            <span className="text-2xl font-bold hover:text-white/90 transition-colors">
              {data.accidents}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

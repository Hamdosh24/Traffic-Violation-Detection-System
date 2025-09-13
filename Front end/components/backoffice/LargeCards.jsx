"use client";
import React, { useState, useEffect } from "react";
import LargeCard from "./LargeCard";
import { StandardApi } from "@/app/api/StandarApi";
import { AlertTriangle } from "lucide-react";

export default function LargeCards() {
  const [streetsData, setStreetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccidentStreets = async () => {
      try {
        setLoading(true);
        const { success, data, error } = await StandardApi.get(
          "/dashboard/acc-streets"
        );

        if (!success) {
          throw new Error(error || "فشل في جلب بيانات الشوارع الخطرة");
        }

        const sortedData = [...data].sort(
          (a, b) => b.accident_count - a.accident_count
        );
        setStreetsData(sortedData.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccidentStreets();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8 ">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-gradient-to-br dark:bg-customDarkGreenbg animate-pulse h-48 shadow-lg p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-300/50"></div>
              <div className="h-6 w-3/4 bg-gray-300/50 rounded"></div>
            </div>
            <div className="mt-auto space-y-4">
              <div className="h-4 w-full bg-gray-300/50 rounded"></div>
              <div className="h-6 w-1/2 bg-gray-300/50 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8">
      {streetsData.map((street, index) => (
        <LargeCard
          key={index}
          data={{
            streetName: street.street_name,
            location: street.region_governorate.replace(/,/g, " - "),
            accidents: street.accident_count,
            rank: index + 1,
          }}
        />
      ))}
    </div>
  );
}

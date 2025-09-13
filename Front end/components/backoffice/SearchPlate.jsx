"use client";
import { StandardApi } from "@/app/api/StandarApi";
import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SearchPlate({ onSearchComplete }) {
  const [plateNumber, setPlateNumber] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;

    const initialData = {
      driverInfo: null,
      sightings: [],
      loading: true,
      error: null,
      invalidPlate: false,
    };
    onSearchComplete(initialData);

    try {
      const response = await StandardApi.searchVehicleSightings(plateNumber);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch data");
      }

      onSearchComplete({
        driverInfo: response.data.driver_info || null,
        sightings: response.data.sightings || [],
        loading: false,
        error: null,
        invalidPlate: false,
      });
    } catch (err) {
      const isInvalidPlate =
        err.message.includes("plate") || err.message.includes("لوحة");

      onSearchComplete({
        driverInfo: null,
        sightings: [],
        loading: false,
        error: isInvalidPlate
          ? null
          : err.message || "حدث خطأ أثناء جلب البيانات. يرجى المحاولة لاحقًا.",
        invalidPlate: isInvalidPlate,
      });
      console.error("Error fetching data:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="search"
            id="plate-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-customGreen focus:border-customGreen dark:bg-customDarkGreen dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-customGreen"
            placeholder="أدخل رقم اللوحة..."
            required
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-customGreen hover:bg-customGreen focus:ring-4 focus:outline-none focus:ring-customGreen/55 font-medium rounded-lg text-sm px-4 py-2 dark:bg-customGreen dark:hover:bg-customGreen/80 "
          >
            بحث
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";
import { StandardApi } from "@/app/api/StandarApi";
import React, { useState } from "react";

export default function SearchPlate() {
  const [plateNumber, setPlateNumber] = useState("");
  const [driverInfo, setDriverInfo] = useState(null);
  const [sightings, setSightings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;

    setLoading(true);
    setError(null);
    setDriverInfo(null);
    setSightings([]);

    try {
      const response = await StandardApi.get(
        `/admin/passing-cars/search/${plateNumber}`
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch data");
      }

      const data = response.data;
      setDriverInfo(data.driver_info);
      setSightings(data.sightings || []);
    } catch (err) {
      setError("حدث خطأ أثناء جلب البيانات. يرجى المحاولة لاحقًا.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            id="plate-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-customGreen focus:border-customGreen dark:bg-customDarkGreen dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen"
            placeholder="أدخل رقم اللوحة..."
            required
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-customGreen hover:bg-customGreen focus:ring-4 focus:outline-none focus:ring-customGreen/55 font-medium rounded-lg text-sm px-4 py-2 dark:bg-customGreen dark:hover:bg-customGreen/80 dark:focus:ring-blue-800"
            disabled={loading}
          >
            {loading ? "جاري البحث..." : "بحث"}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
          {error}
        </div>
      )}

      {driverInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            معلومات السائق
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">الاسم</p>
              <p className="text-gray-900 dark:text-white">
                {driverInfo.first_name} {driverInfo.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                رقم الهاتف
              </p>
              <p className="text-gray-900 dark:text-white">
                {driverInfo.phone_num}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                البريد الإلكتروني
              </p>
              <p className="text-gray-900 dark:text-white">
                {driverInfo.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                رقم اللوحة
              </p>
              <p className="text-gray-900 dark:text-white">
                {driverInfo.plate_num}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sightings.map((sighting) => (
          <div
            key={sighting.id}
            className="p-4 bg-white rounded-lg shadow dark:bg-gray-800 flex justify-between items-center hover:translate-y-1 m-4"
          >
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900">
                  <span className="font-medium text-blue-800 dark:text-blue-300">
                    {sighting.camera_id.split("-")[1]}
                  </span>
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  {sighting.camera.Street}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {new Date(sighting.timestamp).toLocaleString("ar-EG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              {sighting.camera_id}
            </span>
          </div>
        ))}

        {sightings.length === 0 && !loading && plateNumber && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            لا توجد نتائج للبحث
          </div>
        )}
      </div>
    </div>
  );
}

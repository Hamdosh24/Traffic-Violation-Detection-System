"use client";
import { useState } from "react";
import { Search } from "lucide-react";

export default function CameraSearch({ onSearch, loading = false }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="block w-full p-4 ps-10 text-sm border border-gray-300 rounded-lg bg-gray-50 dark:bg-customDarkGreen dark:border-gray-600">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="text-white absolute end-2.5 bottom-2.5 bg-gray-200 dark:bg-gray-700 font-medium rounded-lg text-sm px-4 py-2 animate-pulse w-16 h-10"></div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8 ">
      <div className="relative ">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </div>
        <input
          type="search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-customGreen focus:border-customGreen dark:bg-customDarkGreenbg dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen"
          placeholder="ابحث برقم الكاميرا أو المنطقة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="text-white absolute end-2.5 bottom-2.5 bg-customGreen hover:bg-customGreen focus:ring-4 focus:outline-none focus:ring-customGreen/55 font-medium rounded-lg text-sm px-4 py-2 dark:bg-customGreen dark:hover:bg-customGreen/80 dark:focus:ring-blue-800"
        >
          بحث
        </button>
      </div>
    </form>
  );
}

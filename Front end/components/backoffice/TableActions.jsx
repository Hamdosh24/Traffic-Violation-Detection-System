import React from "react";
import { Search, Trash2Icon, Upload } from "lucide-react";

export default function TableActions() {
  return (
    <div className="flex justify-center items-center py-6 px-12 bg-slate-50 dark:bg-slate-700 rounded-lg gap-8 shadow-md">
      {/* <button>Export</button> */}
      <button className="relative inline-flex items-center justify-center py-3 px-4 space-x-3 text-base font-medium group hover:text-green-700 text-gray-900 border border-slate-900 hover:border-customGreen bg-slate-100 focus:outline-none rounded-lg text-center dark:border-customGreen dark:text-customGreen dark:hover:text-white dark:hover:border-white dark:bg-slate-800">
        <Upload className="w-4 h-4 mr-2" />
        Export
      </button>
      {/* Search */}
      <div className=" flex-grow">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            id="table-search"
            className="block w-full py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-customGreen focus:border-customGreen dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen"
            placeholder="Search for items"
          />
        </div>
      </div>

      {/* Delete */}
      <button className="flex items-center space-x-2 hover:text-red-500 dark:hover:text-white dark:text-slate-300 dark:bg-red-600 text-slate-800 rounded-md px-4 py-2">
        <Trash2Icon />
        <span>Bulk Delete</span>
      </button>
    </div>
  );
}

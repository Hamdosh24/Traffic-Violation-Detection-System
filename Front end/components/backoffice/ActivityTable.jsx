import React, { useState } from "react";
import Data from "../../Activity.json";

const ChevronLeft = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19l-7-7 7-7"
    ></path>
  </svg>
);

const ChevronRight = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
  </svg>
);

// Helper function to determine action color
const getActionColor = (action) => {
  const actionType = action.toLowerCase();

  if (actionType.includes("watch") || actionType.includes("camera")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  } else if (actionType.includes("review") || actionType.includes("footage")) {
    return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
  } else if (actionType.includes("check") || actionType.includes("logs")) {
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  } else if (actionType.includes("monitor") || actionType.includes("alarm")) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  } else if (actionType.includes("update") || actionType.includes("system")) {
    return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
  } else if (actionType.includes("inspect")) {
    return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
  } else if (
    actionType.includes("calibrate") ||
    actionType.includes("sensors")
  ) {
    return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200";
  } else if (
    actionType.includes("test") ||
    actionType.includes("connectivity")
  ) {
    return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
  } else if (actionType.includes("restart")) {
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  } else {
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default function ActivityTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const employees = Data;

  // Filter on both Name and Action
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.Action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Calculate start and end index of items for current page
  const itemStartIndex = (currentPage - 1) * itemsPerPage + 1;
  const itemEndIndex =
    currentPage * itemsPerPage > filteredEmployees.length
      ? filteredEmployees.length
      : currentPage * itemsPerPage;

  // Current page data
  const currentPageData = filteredEmployees.slice(
    itemStartIndex - 1,
    itemEndIndex
  );

  // Navigate to specific page
  const goToPage = (page) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
      <div className="p-4 bg-white dark:bg-gray-800 flex justify-start items-center">
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 pl-10 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Time</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentPageData.length > 0 ? (
            currentPageData.map((employee, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {employee.Name}
                </td>
                <td className="px-6 py-4">{employee.Time}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(
                      employee.Action
                    )}`}
                  >
                    {employee.Action}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white dark:bg-gray-800">
              <td colSpan="3" className="px-6 py-4 text-center">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav
        className="flex items-center dark:bg-gray-700 flex-column flex-wrap md:flex-row justify-between pt-4 p-5"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          Showing{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {itemStartIndex}-{itemEndIndex}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredEmployees.length}
          </span>
        </span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
          <li>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 rounded-s-lg hover:text-blue-700 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400 dark:hover:text-white"
            >
              <ChevronLeft />
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => {
            return (
              <li key={index}>
                <button
                  onClick={() => goToPage(index + 1)}
                  disabled={currentPage === index + 1}
                  className={
                    currentPage === index + 1
                      ? "flex items-center justify-center px-3 h-8 rounded-md text-blue-700 bg-blue-100  dark:border-gray-700  dark:bg-customGreen dark:text-white"
                      : "flex items-center justify-center px-3 h-8 leading-tight rounded-md text-gray-500 hover:bg-slate-200  dark:bg-slate-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-500 dark:hover:text-white"
                  }
                >
                  {index + 1}
                </button>
              </li>
            );
          })}
          <li>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 rounded-s-lg hover:text-blue-700 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400 dark:hover:text-white"
            >
              <ChevronRight />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

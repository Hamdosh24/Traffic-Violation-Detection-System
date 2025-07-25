"use client";
import Link from "next/link";
import React, { useState } from "react";
import employeesData from "../../Account.json";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CrudTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState(employeesData);
  const itemsPerPage = 10;

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.user_id?.includes(searchTerm) ||
      employee.national_num?.includes(searchTerm) ||
      employee.gender?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate showing range
  const itemStartIndex = indexOfFirstItem + 1;
  const itemEndIndex = Math.min(indexOfLastItem, filteredEmployees.length);

  const handleDelete = (id) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا الموظف؟")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const goToPage = (page) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* Search and Add New Button */}
      <div className="p-4 bg-white dark:bg-customDarkGreenbg flex justify-between items-center">
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="ابحث عن الموظفين..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-customDarkGreen dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              الاسم الأول
            </th>
            <th scope="col" className="px-6 py-3">
              الاسم الأخير
            </th>
            <th scope="col" className="px-6 py-3">
              رقم الهوية
            </th>
            <th scope="col" className="px-6 py-3">
              المعرف
            </th>
            <th scope="col" className="px-6 py-3">
              البريد الإلكتروني
            </th>
            <th scope="col" className="px-6 py-3">
              الجنس
            </th>
            <th scope="col" className="px-6 py-3">
              العمر
            </th>
            <th scope="col" className="px-6 py-3">
              رقم الهاتف
            </th>
            <th scope="col" className="px-6 py-3">
              التعديل
            </th>
            <th scope="col" className="px-6 py-3">
              الحذف
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((employee) => (
              <tr
                key={employee.user_id}
                className="bg-white border-b dark:bg-customDarkGreenbg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {employee.first_name}
                </td>
                <td className="px-6 py-4">{employee.last_name}</td>
                <td className="px-6 py-4">{employee.national_num}</td>
                <td className="px-6 py-4">{employee.id}</td>
                <td className="px-6 py-4">{employee.email}</td>
                <td className="px-6 py-4">{employee.gender}</td>
                <td className="px-6 py-4">{employee.age}</td>
                <td className="px-6 py-4">{employee.phone_num}</td>
                <td className="px-6 py-4 space-x-2">
                  <Link
                    href={`/adminDashboard/accounts/${employee.id}/edit`}
                    className="text-blue-600 hover:underline font-bold"
                    passHref
                  >
                    تعديل
                  </Link>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-600 hover:underline font-bold"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white dark:bg-gray-800">
              <td colSpan="10" className="px-6 py-4 text-center">
                لا يوجد موظفون
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav
        className="flex items-center dark:bg-customDarkGreen flex-column flex-wrap md:flex-row justify-between pt-4 p-5"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
          عرض{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {itemStartIndex}-{itemEndIndex}
          </span>{" "}
          من{" "}
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
              <ChevronLeft className="w-4 h-4" />
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => {
            return (
              <li key={index}>
                <button
                  onClick={() => goToPage(index + 1)}
                  className={
                    currentPage === index + 1
                      ? "flex items-center justify-center px-3 h-8 rounded-md text-blue-700 bg-blue-100 dark:border-gray-700 dark:bg-customGreen dark:text-white"
                      : "flex items-center justify-center px-3 h-8 leading-tight rounded-md text-gray-500 hover:bg-slate-200 dark:bg-slate-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-500 dark:hover:text-white"
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
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 rounded-e-lg hover:text-blue-700 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-400 dark:hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

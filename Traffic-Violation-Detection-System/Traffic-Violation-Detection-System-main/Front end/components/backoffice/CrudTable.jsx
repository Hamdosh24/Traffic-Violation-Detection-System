"use client";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StandardApi } from "@/app/api/StandarApi";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CrudTable() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Fetch employees from API
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const {
        success,
        data,
        error: apiError,
      } = await StandardApi.get("/admin/employees");

      if (success) {
        setEmployees(data);
        setTotalItems(data.length);
      } else {
        setError(apiError || "Failed to fetch employees");
      }
    } catch (err) {
      const errorMessage =
        err?.message || err?.toString() || "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error fetching employees:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Client-side filtering
  const filteredEmployees = employees.filter((employee) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      employee.first_name?.toLowerCase().includes(searchLower) ||
      employee.last_name?.toLowerCase().includes(searchLower) ||
      employee.user_name?.toLowerCase().includes(searchLower) ||
      employee.email?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const itemStartIndex = indexOfFirstItem + 1;
  const itemEndIndex = Math.min(indexOfLastItem, filteredEmployees.length);

  const goToPage = (page) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Initial data fetch
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا الموظف؟")) {
      try {
        const {
          success,
          error: apiError,
          message,
        } = await StandardApi.delete(`/admin/employees/${id}`);

        if (success) {
          // تحديث الحالة المحلية
          setEmployees(employees.filter((emp) => emp.user_id !== id));
          setTotalItems((prev) => prev - 1);

          // عرض رسالة نجاح
          toast.success(message || "تم حذف الموظف بنجاح");
        } else {
          throw new Error(apiError || "فشل في حذف الموظف");
        }
      } catch (err) {
        console.error("Error deleting employee:", err);

        // عرض رسالة الخطأ
        toast.error(err.message || "حدث خطأ أثناء حذف الموظف");

        // إذا كان الخطأ متعلقا بالمصادقة
        if (err.message.includes("انتهت صلاحية الجلسة")) {
          router.push("/");
        }
      }
    }
  };

  if (isLoading && employees.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
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
            placeholder="(الاسم, اسم المستخدم , الايميل"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-customDarkGreen dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              اسم المستخدم
            </th>
            <th scope="col" className="px-6 py-3">
              الاسم الأول
            </th>
            <th scope="col" className="px-6 py-3">
              الاسم الأخير
            </th>
            <th scope="col" className="px-6 py-3">
              الرقم الوطني
            </th>
            <th scope="col" className="px-6 py-3">
              البريد الإلكتروني
            </th>
            <th scope="col" className="px-6 py-3">
              رقم الهاتف
            </th>
            <th scope="col" className="px-6 py-3">
              العمر
            </th>
            <th scope="col" className="px-6 py-3">
              الجنس
            </th>
            <th scope="col" className="px-6 py-3">
              تاريخ الإنشاء
            </th>
            <th scope="col" className="px-6 py-3">
              التفاصيل
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
                  {employee.user_name}
                </td>
                <td className="px-6 py-4">{employee.first_name}</td>
                <td className="px-6 py-4">{employee.last_name}</td>
                <td className="px-6 py-4">{employee.national_num}</td>
                <td className="px-6 py-4">{employee.email}</td>
                <td className="px-6 py-4">{employee.phone_num}</td>
                <td className="px-6 py-4">{employee.age}</td>
                <td className="px-6 py-4">{employee.gender}</td>
                <td className="px-6 py-4">
                  {new Date(employee.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() =>
                      router.push(
                        `/adminDashboard/accounts/${employee.user_id}`
                      )
                    }
                    className="text-green-600 hover:underline font-bold"
                  >
                    تفاصيل
                  </button>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <Link
                    href={`/adminDashboard/accounts/${employee.user_id}/edit`}
                    className="text-blue-600 hover:underline font-bold"
                    passHref
                  >
                    تعديل
                  </Link>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleDelete(employee.user_id)}
                    className="text-red-600 hover:underline font-bold"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white dark:bg-gray-800">
              <td colSpan="11" className="px-6 py-4 text-center">
                {searchTerm ? "لا توجد نتائج مطابقة" : "لا يوجد موظفون"}
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
            {searchTerm ? filteredEmployees.length : totalItems}
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
          {Array.from({ length: totalPages }, (_, index) => (
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
          ))}
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

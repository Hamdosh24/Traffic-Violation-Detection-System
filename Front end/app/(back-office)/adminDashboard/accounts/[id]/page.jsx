"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { StandardApi } from "@/app/api/StandarApi";

export default function AccountDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // حالة جديدة لتحميل زر الحذف

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً");
        router.push("/");
        return;
      }

      try {
        setLoading(true);
        const response = await StandardApi.get(`/admin/employees/${id}`);

        if (!response.success) {
          throw new Error(response.error || "فشل في تحميل بيانات الموظف");
        }

        setEmployee(response.data);
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error(error.message);
        router.push("/adminDashboard/accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;

    setIsDeleting(true); // بدء عملية الحذف

    try {
      const response = await StandardApi.delete(`/admin/employees/${id}`);

      if (!response.success) {
        throw new Error(response.error || "فشل في حذف الموظف");
      }

      toast.success(response.message || "تم حذف الموظف بنجاح");
      router.push("/adminDashboard/accounts");
    } catch (error) {
      console.error("Error deleting employee:", error);

      if (error.message.includes("انتهت صلاحية الجلسة")) {
        router.push("/");
      } else {
        toast.error(error.message || "حدث خطأ أثناء حذف الموظف");
      }
    } finally {
      setIsDeleting(false); // انتهاء عملية الحذف
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">الموظف غير موجود</h1>
        <Link
          href="/adminDashboard/accounts"
          className="text-blue-600 hover:underline"
        >
          ← العودة إلى قائمة الحسابات
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          تفاصيل الموظف: {employee.user_name}
        </h1>
        <div className="space-x-2">
          <Link
            href={`/adminDashboard/accounts/${id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-3"
          >
            تعديل
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ${
              isDeleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDeleting ? "جاري الحذف..." : "حذف"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* المعلومات الشخصية */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            المعلومات الشخصية
          </h2>
          <div className="space-y-4">
            <DetailItem
              label="الاسم الكامل"
              value={`${employee.first_name} ${employee.last_name}`}
            />
            <DetailItem label="الرقم الوطني" value={employee.national_num} />
            <DetailItem label="تاريخ الانشاء" value={employee.created_at} />
            <DetailItem label="العمر" value={employee.age} />
            <DetailItem
              label="الجنس"
              value={employee.gender === "male" ? "ذكر" : "أنثى"}
            />
          </div>
        </div>

        {/* معلومات التواصل */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            معلومات التواصل
          </h2>
          <div className="space-y-4">
            <DetailItem label="رقم الهاتف" value={employee.phone_num} />
            <DetailItem label="البريد الإلكتروني" value={employee.email} />
            <DetailItem
              label="الحالة"
              value={
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  نشط
                </span>
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/adminDashboard/accounts"
          className="text-customGreen hover:underline flex items-center"
        >
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          العودة إلى قائمة الحسابات
        </Link>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-gray-900 dark:text-white">
        {value || "غير متوفر"}
      </p>
    </div>
  );
}

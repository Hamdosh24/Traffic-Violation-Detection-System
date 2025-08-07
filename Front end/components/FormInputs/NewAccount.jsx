"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { StandardApi } from "@/app/api/StandarApi";

export default function NewEmployee() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const employeeRole = {
    role_id: 2,
    role_name: "موظف",
  };

  const [formData, setFormData] = useState({
    user_name: "",
    national_num: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_num: "",
    email: "",
    age: "",
    gender: "",
    role_id: employeeRole.role_id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      router.push("/");
      return;
    }

    setIsSubmitting(true);

    try {
      if (
        !formData.user_name ||
        !formData.national_num ||
        !formData.password ||
        !formData.first_name ||
        !formData.last_name ||
        !formData.phone_num ||
        !formData.email ||
        !formData.gender
      ) {
        throw new Error("الرجاء تعبئة جميع الحقول المطلوبة");
      }

      const response = await StandardApi.post(
        "/admin/employees",
        {
          ...formData,
          role_id: employeeRole.role_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.success) {
        throw new Error(response.error || "فشل في إنشاء الموظف");
      }

      toast.success("تم إنشاء الموظف بنجاح");
      router.push("/adminDashboard/accounts");
    } catch (error) {
      console.error("Error creating employee:", error);

      if (error.response?.status === 401) {
        toast.error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
        router.push("/");
      } else if (error.message.includes("network")) {
        toast.error("فشل الاتصال بالخادم، يرجى التحقق من اتصال الشبكة");
      } else {
        toast.error(error.message || "حدث خطأ غير متوقع أثناء إنشاء الموظف");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="p-6 max-w-4xl mx-auto" dir="rtl">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          {/* اسم المستخدم */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
              اسم المستخدم *
            </label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-right"
              required
              placeholder="أدخل اسم المستخدم"
              dir="rtl"
            />
          </div>

          {/* الرقم الوطني */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
              الرقم الوطني *
            </label>
            <input
              type="text"
              name="national_num"
              value={formData.national_num}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-left"
              required
              placeholder="أدخل الرقم الوطني"
            />
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
              كلمة المرور *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-left"
              required
              minLength="6"
              placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
            />
          </div>

          <input type="hidden" name="role_id" value={employeeRole.role_id} />
          {/* الصلاحية */}
          <div className="col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
              الصلاحية
            </label>
            <div className="bg-gray-100 dark:bg-gray-700 p-2.5 rounded-lg text-right">
              {employeeRole.role_name}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 text-right">
              سيتم منح الصلاحية: <strong>موظف</strong> للحساب الجديد
            </p>
          </div>

          {/* الاسم الأول */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
              الاسم الأول *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-right"
              required
              placeholder="أدخل الاسم الأول"
              dir="rtl"
            />
          </div>

          {/* الاسم الأخير */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
              الاسم الأخير *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-right"
              required
              placeholder="أدخل الاسم الأخير"
              dir="rtl"
            />
          </div>

          {/* رقم الهاتف */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
              رقم الهاتف *
            </label>
            <input
              type="tel"
              name="phone_num"
              value={formData.phone_num}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-left"
              required
              placeholder="أدخل رقم الهاتف"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-left"
              required
              placeholder="example@domain.com"
            />
          </div>

          {/* العمر */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
              العمر
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-left"
              min="18"
              max="100"
              placeholder="أدخل العمر"
            />
          </div>

          {/* الجنس */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
              الجنس *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-right"
              required
            >
              <option value="">اختر الجنس</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm ml-3 px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "جاري إنشاء الموظف..." : "إنشاء موظف جديد"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/adminDashboard/accounts")}
            className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm  px-5 py-2.5 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

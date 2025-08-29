"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { StandardApi } from "@/app/api/StandarApi";

export default function EditAccount({ params }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    role_id: "",
    role_name: "",
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً");
        router.push("/");
        return;
      }

      try {
        setIsLoading(true);
        const response = await StandardApi.get(
          `/admin/employees/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.success)
          throw new Error(response.error || "فشل في تحميل بيانات الموظف");

        setFormData({
          ...response.data,
          password: "",
          role_name: response.data.role_name, // تأكد من أن الخادم يُرجع هذا الحقل
        });
      } catch (error) {
        toast.error(error.message);
        router.push("/adminDashboard/accounts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [params.id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
      router.push("/");
      return;
    }

    setIsSubmitting(true);

    try {
      // التحقق من البيانات المطلوبة (باستثناء كلمة المرور والصلاحية)
      const requiredFields = [
        "user_name",
        "national_num",
        "first_name",
        "last_name",
        "phone_num",
        "email",
        "gender",
      ];

      const missingField = requiredFields.find((field) => !formData[field]);
      if (missingField) {
        throw new Error("الرجاء تعبئة جميع الحقول المطلوبة");
      }

      // إعداد بيانات الإرسال حسب التوثيق
      const submitData = {
        user_name: formData.user_name,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_num: formData.phone_num,
        email: formData.email,
        age: formData.age,
        gender: formData.gender,
      };

      // إضافة الحقول الاختيارية إذا كانت موجودة
      if (formData.password) {
        submitData.password = formData.password;
      }
      if (formData.role_id) {
        submitData.role_id = formData.role_id;
      }

      const response = await StandardApi.put(
        `/admin/employees/${params.id}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.success) {
        throw new Error(response.error || "فشل في تحديث بيانات الموظف");
      }

      toast.success("تم تحديث بيانات الموظف بنجاح");
      router.push("/adminDashboard/accounts");
    } catch (error) {
      console.error("Error updating employee:", error);

      if (error.response?.status === 401) {
        toast.error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
        router.push("/");
      } else {
        toast.error(error.message || "حدث خطأ أثناء تحديث البيانات");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-4xl mx-auto">
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        {/* حقل اسم المستخدم */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            اسم المستخدم *
          </label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-right"
            required
            placeholder="أدخل اسم المستخدم"
            dir="rtl"
          />
        </div>

        {/* حقل الرقم الوطني */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            الرقم الوطني *
          </label>
          <input
            type="text"
            name="national_num"
            value={formData.national_num}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-left"
            required
            placeholder="أدخل الرقم الوطني"
          />
        </div>

        {/* حقل كلمة المرور */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            كلمة المرور الجديدة
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-left"
            placeholder="اتركها فارغة للحفاظ على كلمة المرور الحالية"
          />
        </div>

        {/* حقل الصلاحية */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            الصلاحية *
          </label>
          <input
            type="text"
            name="role_id"
            value={formData.role_name} // استخدم role_name بدلاً من role_id لعرض اسم الصلاحية
            readOnly
            className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-right cursor-not-allowed"
          />
        </div>

        {/* حقل الاسم الأول */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            الاسم الأول *
          </label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-right"
            required
            placeholder="أدخل الاسم الأول"
            dir="rtl"
          />
        </div>

        {/* حقل الاسم الأخير */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            الاسم الأخير *
          </label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-right"
            required
            placeholder="أدخل الاسم الأخير"
            dir="rtl"
          />
        </div>

        {/* حقل رقم الهاتف */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            رقم الهاتف *
          </label>
          <input
            type="tel"
            name="phone_num"
            value={formData.phone_num}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-left"
            required
            placeholder="أدخل رقم الهاتف"
          />
        </div>

        {/* حقل البريد الإلكتروني */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-left"
            required
            placeholder="أدخل البريد الإلكتروني"
          />
        </div>

        {/* حقل العمر */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            العمر
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-left"
            placeholder="أدخل العمر"
            min="18"
            max="100"
          />
        </div>

        {/* حقل الجنس */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            الجنس *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-right"
            required
          >
            <option value="">اختر الجنس</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push("/adminDashboard/accounts")}
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-customGreen hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "جاري التحديث..." : "تحديث البيانات"}
        </button>
      </div>
    </form>
  );
}

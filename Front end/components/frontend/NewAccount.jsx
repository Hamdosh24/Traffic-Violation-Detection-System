"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function NewAccount({ initialData = {}, isEditMode = false }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    user_name: "",
    national_num: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_num: "",
    email: "",
    age: "",
    gender: "",
    ...initialData, // تجاوز القيم الافتراضية بالبيانات الأولية في حالة التعديل
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        ...initialData,
        password: "", // إعادة تعيين كلمة المرور في حالة التعديل
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // هنا ستضيف استدعاء API مناسب حسب الوضع (إضافة/تعديل)
      const apiUrl = isEditMode ? `/api/users/${formData.id}` : "/api/users";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("فشل في حفظ البيانات");
      }

      toast.success(
        isEditMode ? "تم تحديث البيانات بنجاح" : "تم إنشاء الحساب بنجاح"
      );
      router.push("/adminDashboard/accounts");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-4xl mx-auto">
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        {/* حقل معرف المستخدم */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-right">
            معرف المستخدم {!isEditMode && "*"}
          </label>
          <input
            type="text"
            name="user_id"
            value={formData.id}
            onChange={handleChange}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-left ${
              isEditMode ? "cursor-not-allowed" : ""
            }`}
            disabled={isEditMode}
            required={!isEditMode}
            placeholder="أدخل المعرف الفريد"
          />
        </div>

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
            كلمة المرور {!isEditMode && "*"}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-customGreen focus:border-customGreen block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-customGreen dark:focus:border-customGreen text-left"
            required={!isEditMode}
            minLength="6"
            placeholder={
              isEditMode
                ? "اتركها فارغة للحفاظ على الحالية"
                : "أدخل كلمة المرور"
            }
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
            placeholder="example@domain.com"
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
            min="1"
            max="120"
            placeholder="أدخل العمر"
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
          {isSubmitting
            ? isEditMode
              ? "جاري التحديث..."
              : "جاري الحفظ..."
            : isEditMode
            ? "تحديث البيانات"
            : "حفظ البيانات"}
        </button>
      </div>
    </form>
  );
}

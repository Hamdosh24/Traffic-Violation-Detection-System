"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Heading from "@/components/backoffice/Heading";
import { toast } from "react-hot-toast";
import Data from "../../../../../../Account.json";
import NewAccount from "@/components/frontend/NewAccount";

export default function EditEmployeePage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState(Data);

  useEffect(() => {
    setIsLoading(true);
    try {
      const foundEmployee = employeesData.find((emp) => emp.id === id);
      if (foundEmployee) {
        setEmployee(foundEmployee);
      } else {
        toast.error("لم يتم العثور على الموظف");
        router.push("/adminDashboard/accounts");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل بيانات الموظف");
    } finally {
      setIsLoading(false);
    }
  }, [id, employeesData, router]);

  const handleSubmit = (formData) => {
    try {
      setIsLoading(true);

      // تحديث البيانات مباشرة في state
      const updatedData = employeesData.map((emp) =>
        emp.id === id ? { ...emp, ...formData } : emp
      );

      setEmployeesData(updatedData);
      toast.success("تم تحديث بيانات الموظف بنجاح");

      // إعادة التوجيه بعد التحديث
      setTimeout(() => {
        router.push("/adminDashboard/accounts");
      }, 1000);
    } catch (error) {
      toast.error(error.message || "فشل في تحديث بيانات الموظف");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customGreen"></div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-4">
        <p className="text-red-500">لم يتم العثور على الموظف</p>
        <button
          onClick={() => router.push("/adminDashboard/accounts")}
          className="mt-4 text-customGreen hover:underline"
        >
          العودة إلى القائمة
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <Heading title={`تعديل الموظف: ${employee.Name}`} />
        <button
          onClick={() => router.push(`/adminDashboard/accounts/${id}`)}
          className="px-4 py-2 bg-customGreen text-white rounded hover:bg-customGreen/75"
        >
          عرض التفاصيل
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <NewAccount
          isEditMode={true}
          initialData={{
            id: employee.id || "", // تأكد من استخدام id بدلاً من ID
            user_name: employee.user_name || "",
            national_num: employee.national_num || "",
            password: "",
            first_name: employee.first_name || "",
            last_name: employee.last_name || "",
            phone_num: employee.phone_num || "",
            email: employee.email || "",
            age: employee.age || "",
            gender: employee.gender || "أنثى", // القيمة الافتراضية الآن "أنثى"
          }}
          onSubmit={(formData) => {
            handleSubmit({
              id: formData.id,
              user_name: formData.user_name,
              national_num: formData.national_num,
              password: formData.password,
              first_name: formData.first_name,
              last_name: formData.last_name,
              phone_num: formData.phone_num,
              email: formData.email,
              age: formData.age,
              gender: formData.gender,
            });
          }}
          onCancel={() => router.push("/adminDashboard/accounts")}
        />
      </div>
    </div>
  );
}

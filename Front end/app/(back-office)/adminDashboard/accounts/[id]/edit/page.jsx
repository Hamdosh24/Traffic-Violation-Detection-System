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
      // تحويل كلا القيمتين إلى سلسلة نصية للمقارنة
      const foundEmployee = employeesData.find(
        (emp) => emp.id.toString() === id.toString()
      );

      if (foundEmployee) {
        setEmployee(foundEmployee);
      } else {
        toast.error("لم يتم العثور على الموظف");
        router.push("/adminDashboard/accounts");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل بيانات الموظف");
      console.error("Error details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, employeesData, router]);

  const handleSubmit = (formData) => {
    try {
      setIsLoading(true);

      const updatedData = employeesData.map((emp) =>
        emp.id.toString() === id.toString() ? { ...emp, ...formData } : emp
      );

      setEmployeesData(updatedData);
      toast.success("تم تحديث بيانات الموظف بنجاح");

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
    return <div className="p-4">جاري تحميل البيانات...</div>;
  }

  if (!employee) {
    return (
      <div className="p-4">
        <p className="text-red-500">لم يتم العثور على الموظف</p>
        <button
          onClick={() => router.push("/adminDashboard/accounts")}
          className="mt-4 px-4 py-2 bg-customGreen text-white rounded"
        >
          العودة إلى القائمة
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <Heading
          title={`تعديل معلومات الموظف: ${employee.first_name} ${employee.last_name}`}
        />
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
            id: employee.id,
            user_name: employee.user_name,
            national_num: employee.national_num,
            password: "", // لا نرسل كلمة السر الحالية
            first_name: employee.first_name,
            last_name: employee.last_name,
            phone_num: employee.phone_num,
            email: employee.email,
            age: employee.age,
            gender: employee.gender,
          }}
          onSubmit={(formData) => {
            handleSubmit({
              id: formData.id,
              user_name: formData.user_name,
              national_num: formData.national_num,
              password: formData.password, // سيتم تجاهلها إذا كانت فارغة
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

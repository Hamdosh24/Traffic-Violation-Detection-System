"use client";
import Heading from "@/components/backoffice/Heading";
import EditAccount from "../../../../../../components/FormInputs/EditAccount";
import { useEffect, useState } from "react";
import { StandardApi } from "@/app/api/StandarApi";
import { toast } from "react-hot-toast";

export default function EditEmployeePage({ params }) {
  const [employee, setEmployee] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً");
        return;
      }

      try {
        const response = await StandardApi.get(
          `/admin/employees/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.success) {
          throw new Error(response.error || "فشل في تحميل بيانات الموظف");
        }

        setEmployee({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
        });
      } catch (error) {
        console.error("Error fetching employee:", error);
        toast.error(error.message);
      }
    };

    fetchEmployeeData();
  }, [params.id]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <Heading
          title={`تعديل معلومات الموظف: ${employee.first_name} ${employee.last_name}`}
        />
      </div>
      <EditAccount params={params} />
    </div>
  );
}

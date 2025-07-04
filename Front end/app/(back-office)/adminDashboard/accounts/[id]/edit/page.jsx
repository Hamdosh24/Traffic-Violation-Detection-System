"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EmployeeForm from "@/components/backoffice/EmployeeInfo";
import Heading from "@/components/backoffice/Heading";
import { toast } from "react-hot-toast";
import Data from "../../../../../../Account.json";

export default function EditEmployeePage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState(Data);

  useEffect(() => {
    setIsLoading(true);
    try {
      const foundEmployee = employeesData.find((emp) => emp.ID === id);
      if (foundEmployee) {
        setEmployee(foundEmployee);
      } else {
        toast.error("Employee not found");
      }
    } catch (error) {
      toast.error("Error loading employee dats");
    } finally {
      setIsLoading(false);
    }
  }, [id, employeesData]);

  const handleSubmit = (formData) => {
    try {
      setIsLoading(true);

      // تحديث البيانات مباشرة في state
      const updatedData = employeesData.map((emp) =>
        emp.ID === id ? { ...emp, ...formData } : emp
      );

      setEmployeesData(updatedData);
      toast.success("Employee updated successfully");

      // إعادة التوجيه بعد التحديث
      setTimeout(() => {
        router.push("/adminDashboard/accounts");
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Failed to update employee");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-4">
        <p className="text-red-500">Employee not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <Heading title={`Edit Employee: ${employee.Name}`} />
        <button
          onClick={() => router.push(`/adminDashboard/accounts/${id}`)}
          className="px-4 py-2 bg-customGreen text-white rounded hover:bg-customGreen/75"
        >
          View Details
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <EmployeeForm
          initialData={employee}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          onCancel={() => router.push(`/adminDashboard/accounts/${id}`)}
        />
      </div>
    </div>
  );
}

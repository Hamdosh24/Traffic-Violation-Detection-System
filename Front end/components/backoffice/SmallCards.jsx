"use client";
import React, { useState, useEffect } from "react";
import SmallCard from "./SmallCard";
import { StandardApi } from "@/app/api/StandarApi";
import { AlertCircle, Car, Camera, AlertTriangle } from "lucide-react";

export default function SmallCards() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const { success, data, error } = await StandardApi.get(
          "/dashboard/infos"
        );

        if (!success) {
          throw new Error(error || "فشل في جلب بيانات لوحة التحكم");
        }

        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow animate-pulse h-32"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong>خطأ!</strong> {error}
      </div>
    );
  }

  const cardsData = [
    {
      title: "المخالفات اخر 30 يوم",
      number: dashboardData?.violations_this_month || 0,
      iconBg: "bg-red-500 dark:bg-red-500",
      icon: AlertTriangle,
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      title: "الحوادث اخر 30 يوم",
      number: dashboardData?.accidents_this_month || 0,
      iconBg: "bg-yellow-500 dark:bg-yellow-500",
      icon: AlertCircle,
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "أكثر مخالفة تكرارا",
      text: dashboardData?.most_common_violation || "لا توجد بيانات",
      iconBg: "bg-blue-500 text-black dark:bg-blue-500",
      icon: Car,
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "إجمالي الكاميرات",
      number: dashboardData?.total_cameras || 0,
      iconBg: "bg-green-500 dark:bg-green-500",
      icon: Camera,
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-8">
      {cardsData.map((data, i) => (
        <SmallCard data={data} key={i} />
      ))}
    </div>
  );
}

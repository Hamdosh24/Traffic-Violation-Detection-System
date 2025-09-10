"use client";
import React from "react";

function SightingsTable({ sightings, driverInfo }) {
  if (!sightings.length) return null;

  return (
    <div className="mt-6">
      {/* للعروض الكبيرة: جدول. للعروض الصغيرة: بطاقات */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                معرف الكاميرا
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                المحافظة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                المنطقة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الشارع
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                التاريخ والوقت
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sightings.map((sighting, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {sighting.camera?.camera_id || "غير متوفر"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {sighting.camera?.governorate || "غير متوفر"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {sighting.camera?.region || "غير متوفر"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {sighting.camera?.street || "غير متوفر"}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                  dir="ltr"
                >
                  {sighting.timestamp || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* شاشات صغيرة: عرض كل مشاهدة كـ بطاقة */}
      <div className="md:hidden space-y-3">
        {sightings.map((sighting, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
            dir="rtl"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  رقم اللوحة
                </p>
                <p className="font-medium dark:text-white">
                  {sighting.plate_num || driverInfo?.plate_num || "غير متوفر"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  الوقت
                </p>
                <p className="font-medium dark:text-white" dir="ltr">
                  {sighting.timestamp || "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-900 dark:text-white">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  معرف الكاميرا
                </p>
                <p className="font-medium dark:text-white">
                  {sighting.camera?.camera_id || "غير متوفر"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  المحافظة
                </p>
                <p className="font-medium dark:text-white">
                  {sighting.camera?.governorate || "غير متوفر"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  المنطقة
                </p>
                <p className="font-medium dark:text-white">
                  {sighting.camera?.region || "غير متوفر"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  الشارع
                </p>
                <p className="font-medium dark:text-white">
                  {sighting.camera?.street || "غير متوفر"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchResults({
  driverInfo,
  sightings = [],
  loading,
  error,
}) {
  // إضافة حالة لتتبع ما إذا كان قد تم إجراء بحث من قبل
  const hasSearched =
    sightings.length > 0 || loading || error || driverInfo !== null;

  return (
    <div className="max-w-4xl mx-auto px-4">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {driverInfo ? (
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6"
          dir="rtl"
        >
          <h3 className="text-lg font-semibold text-customGreen dark:text-white mb-4">
            معلومات السائق
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                صاحب المركبة
              </p>
              <p className="font-medium dark:text-white">
                {driverInfo.full_name || "غير متوفر"}
              </p>
            </div>

            <div className="flex flex-col justify-start items-start">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                رقم الهاتف
              </p>
              <p className="font-medium dark:text-white" dir="ltr">
                {driverInfo.phone_num || "غير متوفر"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                رقم اللوحة
              </p>
              <p className="font-medium dark:text-white">
                {driverInfo.plate_num || "غير متوفر"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // عرض رسالة عندما لا يكون هناك بيانات سائق فقط إذا كان قد تم البحث مسبقاً
        hasSearched &&
        !loading &&
        !error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              لا يوجد بيانات للسائق متاحة للعرض
            </p>
          </div>
        )
      )}

      {/* حالة عدم وجود نتائج بعد البحث */}
      {!loading &&
        sightings.length === 0 &&
        driverInfo === null &&
        !error &&
        !hasSearched && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            الرجاء إدخال رقم لوحة المركبة للبحث
          </div>
        )}

      {/* نتائج المشاهدات */}
      {sightings.length > 0 && (
        <div dir="rtl" className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white my-6">
            المشاهدات المسجلة
          </h3>

          <SightingsTable sightings={sightings} driverInfo={driverInfo} />
        </div>
      )}
    </div>
  );
}

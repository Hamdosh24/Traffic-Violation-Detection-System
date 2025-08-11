"use client";
import React from "react";

export default function SearchResults({
  driverInfo,
  sightings,
  loading,
  error,
}) {
  return (
    <div className="max-w-4xl mx-auto">
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

      {driverInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            معلومات السائق
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 dark:text-gray-300">الاسم الأول:</p>
              <p className="font-medium dark:text-white">
                {driverInfo.first_name || "غير متوفر"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">الاسم الأخير:</p>
              <p className="font-medium dark:text-white">
                {driverInfo.last_name || "غير متوفر"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">رقم الهاتف:</p>
              <p className="font-medium dark:text-white">
                {driverInfo.phone_num || "غير متوفر"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">
                البريد الإلكتروني:
              </p>
              <p className="font-medium dark:text-white">
                {driverInfo.email || "غير متوفر"}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-300">رقم اللوحة:</p>
              <p className="font-medium dark:text-white">
                {driverInfo.plate_num || "غير متوفر"}
              </p>
            </div>
          </div>
        </div>
      )}

      {sightings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            المشاهدات المسجلة
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    رقم المشاهدة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    رقم اللوحة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    معرف الكاميرا
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    المنطقة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    المحافظة
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
                {sightings.map((sighting, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sighting.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sighting.plate_num}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sighting.camera_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sighting.camera?.region || "غير متوفر"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sighting.camera?.governorate || "غير متوفر"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sighting.camera?.street || "غير متوفر"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sighting.timestamp || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && sightings.length === 0 && driverInfo === null && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          الرجاء إدخال رقم لوحة المركبة للبحث
        </div>
      )}
    </div>
  );
}

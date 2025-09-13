"use client";
import { Info, AlertCircle, AlertTriangle } from "lucide-react";

function SightingsTable({ sightings, driverInfo }) {
  if (!sightings.length) return null;

  return (
    <div className="mt-6">
      {/* للعروض الكبيرة: جدول. للعروض الصغيرة: بطاقات */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-50 dark:bg-customDarkGreen">
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
          <tbody className="divide-y divide-gray-200 dark:bg-customDarkGreenbg dark:divide-gray-700">
            {sightings.map((sighting, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-customDarkGreen"
              >
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
            className="bg-white dark:bg-customDarkGreenbg rounded-lg shadow p-4"
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
  hasSearched,
  invalidPlate,
}) {
  // حالة عدم البحث بعد (الصفحة الأولى)
  if (!hasSearched) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-customDarkGreenbg rounded-lg shadow p-8 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mb-4">
            <Info className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            نظام تتبع المركبات
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            الرجاء ادخال رقم لوحة للتعقب
          </p>
        </div>
      </div>
    );
  }

  // حالة التحميل
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customGreen"></div>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-300 mt-4">
          جاري البحث عن معلومات المركبة...
        </p>
      </div>
    );
  }

  // حالة وجود خطأ
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-customDarkGreenbg dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  // حالة رقم اللوحة غير الصالح
  if (invalidPlate) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-customDarkGreenbg rounded-lg shadow p-8 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            رقم لوحة غير صالح
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            رقم اللوحة المدخل غير صالح. يرجى التحقق والمحاولة مرة أخرى.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      {driverInfo ? (
        <div
          className="bg-white dark:bg-customDarkGreenbg rounded-lg shadow p-6 mb-6"
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
        //  عرض رسالة عندما لا يكون هناك بيانات سائق فقط
        hasSearched && (
          <div className="bg-white dark:bg-customDarkGreenbg rounded-lg shadow p-6 mb-6 text-center">
            <p className="text-gray-600 dark:text-white ">
              لا يوجد بيانات للسائق متاحة للعرض
            </p>
          </div>
        )
      )}

      {/* نتائج المشاهدات */}
      {sightings.length > 0 ? (
        <div dir="rtl" className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white my-6">
            المشاهدات المسجلة
          </h3>

          <SightingsTable sightings={sightings} driverInfo={driverInfo} />
        </div>
      ) : hasSearched && driverInfo ? (
        <div className="bg-white dark:bg-customDarkGreenbg rounded-lg shadow p-8 text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-yellow-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            لا توجد مشاهدات
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            لم يتم رصد أي مشاهدات للمركبة في نظام الكاميرات.
          </p>
        </div>
      ) : null}
    </div>
  );
}

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
            {/* ... نفس محتوى معلومات السائق ... */}
          </div>
        </div>
      )}

      {sightings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            المشاهدات المسجلة
          </h3>
          {/* ... نفس محتوى عرض المشاهدات ... */}
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

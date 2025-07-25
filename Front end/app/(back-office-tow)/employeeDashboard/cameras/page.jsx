"use client";
import Heading from "@/components/backoffice/Heading";
import CameraCard from "@/components/backoffice/CameraCard";
import CameraSearch from "@/components/backoffice/CameraSearch";
import React, { useState } from "react";

export default function CamerasPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const cameraInfo = [
    {
      id: "IG1-452",
      address: "تقاطع الملك فهد مع الجامعة - الرياض",
      time: "2023-11-15T14:30:00Z",
      region: "الرياض",
      status: "نشطة",
      resolution: "1080p",
      streamUrl: "rtsp://example.com/stream1",
    },
    {
      id: "IG2-453",
      address: "شارع التحلية - جدة",
      time: "2023-11-15T15:00:00Z",
      region: "جدة",
      status: "نشطة",
      resolution: "720p",
      streamUrl: "rtsp://example.com/stream2",
    },
    {
      id: "IG3-454",
      address: "دوار العليا - الرياض",
      time: "2023-11-15T14:45:00Z",
      region: "الرياض",
      status: "غير نشطة",
      resolution: "1080p",
      streamUrl: "rtsp://example.com/stream3",
    },
    {
      id: "IG4-455",
      address: "شارع الأمير سلطان - مكة",
      time: "2023-11-15T13:30:00Z",
      region: "مكة",
      status: "نشطة",
      resolution: "4K",
      streamUrl: "rtsp://example.com/stream4",
    },
    {
      id: "IG5-456",
      address: "شارع الأمير محمد بن عبدالعزيز - المدينة",
      time: "2023-11-15T14:00:00Z",
      region: "المدينة",
      status: "نشطة",
      resolution: "1080p",
      streamUrl: "rtsp://example.com/stream5",
    },
    {
      id: "IG6-457",
      address: "شارع التحلية - جدة",
      time: "2023-11-15T15:30:00Z",
      region: "جدة",
      status: "صيانة",
      resolution: "720p",
      streamUrl: "rtsp://example.com/stream6",
    },
    {
      id: "IG7-458",
      address: "دوار العليا - الرياض",
      time: "2023-11-15T14:15:00Z",
      region: "الرياض",
      status: "نشطة",
      resolution: "1080p",
      streamUrl: "rtsp://example.com/stream7",
    },
    {
      id: "IG8-459",
      address: "شارع الستين - الأحساء",
      time: "2023-11-15T13:45:00Z",
      region: "الأحساء",
      status: "غير نشطة",
      resolution: "720p",
      streamUrl: "rtsp://example.com/stream8",
    },
    {
      id: "IG9-460",
      address: "شارع الملك عبدالله - الدمام",
      time: "2023-11-15T15:15:00Z",
      region: "الدمام",
      status: "نشطة",
      resolution: "1080p",
      streamUrl: "rtsp://example.com/stream9",
    },
    {
      id: "IG10-461",
      address: "محطة القطار - الرياض",
      time: "2023-11-15T14:50:00Z",
      region: "الرياض",
      status: "نشطة",
      resolution: "4K",
      streamUrl: "rtsp://example.com/stream10",
    },
  ];

  // تحديد البيانات المعروضة بناءً على حالة البحث
  const displayedCameras = searchTerm
    ? cameraInfo.filter(
        (camera) =>
          camera.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          camera.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          camera.region.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cameraInfo;

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div>
      <Heading title="الكاميرات" />

      <div className="max-w-4xl mx-auto pt-8">
        {/* استخدام مكون البحث الجديد */}
        <CameraSearch onSearch={handleSearch} />

        {/* عرض القائمة الكاملة أو النتائج حسب البحث */}
        <div className="mt-10">
          {displayedCameras.length > 0 ? (
            displayedCameras.map((item, i) => (
              <CameraCard key={i} data={item} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد كاميرات متاحة"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

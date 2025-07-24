"use client";
import Heading from "@/components/backoffice/Heading";
import CameraCard from "@/components/backoffice/CameraCard";
import React from "react";

export default function CamerasPage() {
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
      id: "IG1-452",
      address: "تقاطع الملك فهد مع الجامعة - الرياض",
      time: "2023-11-15T14:30:00Z",
      region: "الرياض",
      status: "نشطة",
      resolution: "1080p",
      streamUrl: "rtsp://example.com/stream1",
    },
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
      id: "IG1-452",
      address: "تقاطع الملك فهد مع الجامعة - الرياض",
      time: "2023-11-15T14:30:00Z",
      region: "الرياض",
      status: "نشطة",
      resolution: "1080p",
      streamUrl: "rtsp://example.com/stream1",
    },
  ];

  return (
    <div>
      <Heading title="الكاميرات" />
      <div className="mt-10">
        {cameraInfo.map((item, i) => (
          <CameraCard key={i} data={item} />
        ))}
      </div>
    </div>
  );
}

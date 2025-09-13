"use client";
import Heading from "@/components/backoffice/Heading";
import CameraCard from "@/components/backoffice/CameraCard";
import CameraSearch from "@/components/backoffice/CameraSearch";
import { useState, useEffect, useMemo } from "react";
import { StandardApi } from "@/app/api/StandarApi";
import { useRouter } from "next/navigation";

export default function CamerasPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await StandardApi.fetchAllCameras();

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch cameras");
        }

        setCameras(response.data || []);
      } catch (err) {
        console.error("Error fetching cameras:", err);
        setError(err.message || "An error occurred while loading cameras");
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  const displayedCameras = useMemo(() => {
    if (!searchTerm) return cameras;

    return cameras.filter((camera) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        camera.camera_id.toString().includes(searchTerm) ||
        (camera.region && camera.region.toLowerCase().includes(searchLower)) ||
        (camera.governorate &&
          camera.governorate.toLowerCase().includes(searchLower)) ||
        (camera.street && camera.street.toLowerCase().includes(searchLower))
      );
    });
  }, [cameras, searchTerm]);

  const handleViewDetails = (cameraId) => {
    router.push(`/employeeDashboard/cameras/${cameraId}`);
  };

  return (
    <div>
      <Heading title="الكاميرات" />

      <div className="max-w-4xl mx-auto pt-8">
        <CameraSearch onSearch={setSearchTerm} loading={loading} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong>خطأ!</strong> {error}
          </div>
        )}

        <div className="mt-10">
          {loading ? (
            // Skeleton loading state
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="max-w-4xl mx-auto shadow-lg rounded-lg flex justify-between items-center bg-white/50 dark:bg-customDarkGreen p-4"
                >
                  <div className="flex items-center space-x-4 rtl:space-x-reverse w-full">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : displayedCameras.length > 0 ? (
            // بيانات حقيقية
            displayedCameras.map((camera) => (
              <CameraCard
                key={camera.camera_id}
                data={camera}
                onViewDetails={() => handleViewDetails(camera.camera_id)}
              />
            ))
          ) : (
            // لما ما يكون في نتائج
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد كاميرات متاحة"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

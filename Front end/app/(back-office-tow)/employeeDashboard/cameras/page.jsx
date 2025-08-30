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
        <CameraSearch onSearch={setSearchTerm} />

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">جاري تحميل بيانات الكاميرات...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong>خطأ!</strong> {error}
          </div>
        )}

        <div className="mt-10">
          {!loading && !error && displayedCameras.length > 0
            ? displayedCameras.map((camera) => (
                <CameraCard
                  key={camera.camera_id}
                  data={camera}
                  onViewDetails={() => handleViewDetails(camera.camera_id)}
                />
              ))
            : !loading &&
              !error && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد كاميرات متاحة"}
                </div>
              )}
        </div>
      </div>
    </div>
  );
}

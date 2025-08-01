"use client";
import Heading from "@/components/backoffice/Heading";
import CameraCard from "@/components/backoffice/CameraCard";
import CameraSearch from "@/components/backoffice/CameraSearch";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { StandardApi } from "@/app/api/StandarApi";

export default function CamerasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchRef = useRef();

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  useEffect(() => {
    searchRef.current = handleSearch;
  }, [handleSearch]);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await StandardApi.get("/cameras");

        if (!response.success) {
          throw new Error(response.error || "فشل في جلب بيانات الكاميرات");
        }

        setCameras(response.data);
      } catch (err) {
        console.error("حدث خطأ أثناء جلب الكاميرات:", err);
        setError(err.message || "حدث خطأ غير متوقع");
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  const displayedCameras = useMemo(() => {
    return searchTerm
      ? cameras.filter(
          (camera) =>
            camera.camera_id.toString().includes(searchTerm) ||
            camera.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
            camera.governorate.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : cameras;
  }, [cameras, searchTerm]);

  return (
    <div>
      <Heading title="الكاميرات" />

      <div className="max-w-4xl mx-auto pt-8">
        <CameraSearch onSearch={handleSearch} />

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
                <CameraCard key={camera.camera_id} data={camera} />
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

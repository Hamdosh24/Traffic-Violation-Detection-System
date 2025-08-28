"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import { StandardApi } from "@/app/api/StandarApi";

const SSEContext = createContext(null);

export const SSEProvider = ({ children }) => {
  const [unviewedCount, setUnviewedCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef(null);

  const connectSSE = useCallback(() => {
    // إذا كان الاتصال موجودًا بالفعل، لا تقم بإنشاء اتصال جديد
    if (eventSourceRef.current) {
      console.log("SSE connection already exists.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Cannot establish SSE connection.");
      return;
    }

    const eventSourceUrl = `${
      StandardApi.STREAM_URL
    }/admin/accidents/stream?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(eventSourceUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("✅ SSE connection established.");
      setIsConnected(true);
    };

    eventSource.addEventListener("new-accident", (event) => {
      try {
        console.log("📨 New accident received:", event.data);
        setUnviewedCount((prevCount) => prevCount + 1);
      } catch (e) {
        console.error("❌ Error parsing accident data:", e);
      }
    });

    eventSource.onerror = (err) => {
      console.error("❌ SSE connection error:", err);
      setIsConnected(false);
      eventSource.close();
      eventSourceRef.current = null;
      // محاولة إعادة الاتصال بعد 5 ثوانٍ
      setTimeout(connectSSE, 5000);
    };
  }, []);

  const disconnectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      console.log("🔌 Disconnecting SSE...");
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      setUnviewedCount(0); // إعادة تعيين العداد عند تسجيل الخروج
    }
  }, []);

  // دالة لتحديث عدد الإشعارات يدويًا (عند مشاهدة الحوادث)
  const updateUnviewedCount = useCallback((newCount) => {
    setUnviewedCount(newCount);
  }, []);

  const value = {
    unviewedCount,
    isConnected,
    connectSSE,
    disconnectSSE,
    updateUnviewedCount,
  };

  return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
};

export const useSSE = () => {
  const context = useContext(SSEContext);
  if (context === null) {
    throw new Error("useSSE must be used within an SSEProvider");
  }
  return context;
};

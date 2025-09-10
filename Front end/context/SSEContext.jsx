"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { StandardApi } from "@/app/api/StandarApi";

const SSEContext = createContext(null);

export const SSEProvider = ({ children }) => {
  const [unviewedCount, setUnviewedCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [newAccidents, setNewAccidents] = useState([]);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
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
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    eventSource.addEventListener("new-accident", (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 New accident received:", data); // Using the setter functions directly, which is correct

        setNewAccidents((prevAccidents) => {
          const transformedData = {
            id: data.id || `temp-${Date.now()}`,
            status: data.status || "new",
            timestamp: data.timestamp || new Date().toISOString(),
            camera: data.camera || {
              camera_id: "غير معروف",
              governorate: "غير معروف",
              region: "غير معروف",
              street: "غير معروف",
              coordinates: "0,0",
            },
          };
          return [transformedData, ...prevAccidents];
        });
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

      if (!reconnectTimeoutRef.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null;
          connectSSE();
        }, 5000);
      }
    };
    // The fix: Add all dependencies that affect the closure
  }, [setNewAccidents, setUnviewedCount]);

  const disconnectSSE = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      connectSSE();
    }, 1000);

    return () => {
      clearTimeout(timeout);
      disconnectSSE();
    };
  }, [connectSSE, disconnectSSE]);

  const updateUnviewedCount = useCallback((newCount) => {
    setUnviewedCount(newCount);
  }, []);

  const addNewAccident = useCallback((accident) => {
    setNewAccidents((prev) => [accident, ...prev]);
    setUnviewedCount((prev) => prev + 1);
  }, []);

  const clearNewAccidents = useCallback(() => {
    setNewAccidents([]);
  }, []);

  const value = {
    unviewedCount,
    isConnected,
    newAccidents,
    connectSSE,
    disconnectSSE,
    updateUnviewedCount,
    addNewAccident,
    clearNewAccidents,
    setNewAccidents,
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

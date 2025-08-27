import { StandardApi } from "@/app/api/StandarApi";
import { create } from "zustand";

const useAccidentStore = create((set, get) => ({
  accidents: [],
  unviewedCount: 0,
  isLoading: false,
  error: null,
  sseConnection: null,
  isConnected: false,

  // جلب جميع الحوادث
  fetchAccidents: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await StandardApi.fetchAllAccidents();
      if (result.success) {
        const accidentsData = Array.isArray(result.data) ? result.data : [];
        set({
          accidents: accidentsData,
          unviewedCount: accidentsData.filter(
            (accident) => accident.status === "new"
          ).length,
        });
      } else {
        set({ error: result.error });
      }
    } catch (error) {
      set({ error: "حدث خطأ أثناء جلب الحوادث" });
    } finally {
      set({ isLoading: false });
    }
  },

  // تعيين حادث كمشاهدة
  markAsViewed: async (accidentId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await StandardApi.markAccidentAsViewed(accidentId);
      if (result.success) {
        set((state) => {
          const updatedAccidents = state.accidents.map((accident) =>
            accident.id === accidentId
              ? { ...accident, status: "acknowledged" }
              : accident
          );
          return {
            accidents: updatedAccidents,
            unviewedCount: updatedAccidents.filter(
              (acc) => acc.status === "new"
            ).length,
          };
        });
      } else {
        set({ error: result.error });
      }
    } catch (error) {
      set({ error: "حدث خطأ أثناء تحديث حالة الحادث" });
    } finally {
      set({ isLoading: false });
    }
  },

  // تعيين جميع الحوادث كمشاهدة
  markAllAsViewed: async () => {
    set({ isLoading: true, error: null });
    try {
      const unviewedAccidents = get().accidents.filter(
        (acc) => acc.status === "new"
      );

      if (unviewedAccidents.length === 0) {
        set({ isLoading: false });
        return;
      }

      // إرسال طلبات لتحديث جميع الحوادث غير المشاهدة
      const updatePromises = unviewedAccidents.map((accident) =>
        StandardApi.markAccidentAsViewed(accident.id)
      );

      const results = await Promise.all(updatePromises);
      const allSuccess = results.every((result) => result.success);

      if (allSuccess) {
        set((state) => ({
          accidents: state.accidents.map((acc) =>
            acc.status === "new" ? { ...acc, status: "acknowledged" } : acc
          ),
          unviewedCount: 0,
        }));
      } else {
        set({ error: "فشل في تحديث بعض الحوادث" });
      }
    } catch (error) {
      set({ error: "حدث خطأ أثناء تحديث الحوادث" });
    } finally {
      set({ isLoading: false });
    }
  },

  // تنظيف اتصال SSE
  cleanupSSE: () => {
    const { sseConnection } = get();
    if (sseConnection && typeof sseConnection.close === "function") {
      sseConnection.close();
    }

    if (window.currentEventSource) {
      window.currentEventSource.close();
      window.currentEventSource = null;
    }

    set({ sseConnection: null, isConnected: false });
  },

  // معالج لبيانات الحادث الجديد
  handleNewAccident: (data) => {
    try {
      console.log("Processing new accident:", data);

      // التأكد من أن البيانات تحتوي على الهيكل المتوقع
      const newAccident = {
        id: data.id,
        timestamp: data.timestamp,
        status: data.status || "new",
        camera: data.camera || {}, // استخدام البيانات كما هي من الخادم
      };

      set((state) => ({
        accidents: [newAccident, ...state.accidents],
        unviewedCount:
          state.unviewedCount + (newAccident.status === "new" ? 1 : 0),
      }));

      // إشعار بصوت عند وصول حادث جديد (اختياري)
      if (newAccident.status === "new" && typeof window !== "undefined") {
        try {
          const audio = new Audio("/notification-sound.mp3");
          audio.play().catch((e) => console.log("Cannot play sound:", e));
        } catch (e) {
          console.log("Sound notification error:", e);
        }
      }
    } catch (error) {
      console.error("Error processing new accident:", error, data);
    }
  },

  // معالج لإعادة الاتصال
  handleReconnect: () => {
    console.log("تم إعادة الاتصال، جلب الحوادث مرة أخرى...");
    get().fetchAccidents();
    set({ isConnected: true, error: null });
  },

  // إعداد اتصال SSE
  setupSSEConnection: () => {
    const { cleanupSSE, handleNewAccident, handleReconnect } = get();

    // تنظيف أي اتصال موجود
    cleanupSSE();

    // جلب البيانات الحالية أولاً
    get().fetchAccidents();

    // إعداد اتصال SSE جديد
    const sseConnection = StandardApi.setupAccidentSSE(
      handleNewAccident,
      handleReconnect
    );

    set({ sseConnection, isConnected: true, error: null });
  },

  // فصل اتصال SSE (للاستخدام في useEffect cleanup)
  disconnectSSE: () => {
    get().cleanupSSE();
  },

  // إعادة الاتصال يدوياً
  reconnectSSE: () => {
    get().setupSSEConnection();
  },
}));

export default useAccidentStore;

import { StandardApi } from "@/app/api/StandarApi";
import { create } from "zustand";

const useAccidentStore = create((set, get) => ({
  accidents: [],
  unviewedCount: 0,
  isLoading: false,
  error: null,
  eventSource: null,
  isConnected: false,
  reconnectionTimeout: null,

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

  // معالج لبيانات الحادث الجديد
  handleNewAccident: (data) => {
    try {
      console.log("Processing new accident:", data);

      const newAccident = {
        id: data.id,
        timestamp: data.timestamp,
        status: data.status || "new",
        camera: data.camera || {},
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

  // إعداد اتصال SSE (يجب أن يتم استدعاؤه مرة واحدة)
  setupSSEConnection: () => {
    const {
      eventSource,
      fetchAccidents,
      handleNewAccident,
      reconnectionTimeout,
    } = get();

    // إذا كان هناك اتصال قائم أو جاري محاولة إعادة الاتصال، لا تفعل شيئاً
    if (eventSource || reconnectionTimeout) {
      return;
    }

    // قم بجلب الحوادث الموجودة أولاً
    fetchAccidents();

    const sse = StandardApi.setupAccidentSSE(
      handleNewAccident,
      // onOpen
      () => {
        set({ isConnected: true, error: null, reconnectionTimeout: null });
      },
      // onError
      (error) => {
        console.error(
          "SSE connection error occurred. Attempting to reconnect...",
          error
        );
        get().disconnectSSE(); // أغلق الاتصال الحالي
        set({ isConnected: false });

        // حاول إعادة الاتصال بعد 5 ثوانٍ
        const timeoutId = setTimeout(() => {
          get().setupSSEConnection();
        }, 5000);

        set({ reconnectionTimeout: timeoutId });
      }
    );

    set({ eventSource: sse, isConnected: sse ? true : false });
  },

  // فصل اتصال SSE (للاستخدام في useEffect cleanup)
  disconnectSSE: () => {
    const { eventSource, reconnectionTimeout } = get();
    if (eventSource) {
      StandardApi.disconnectSSE(eventSource);
      set({ eventSource: null });
    }
    if (reconnectionTimeout) {
      clearTimeout(reconnectionTimeout);
      set({ reconnectionTimeout: null });
    }
    set({ isConnected: false });
  },

  // إعادة الاتصال يدوياً
  reconnectSSE: () => {
    const { isConnected, setupSSEConnection, disconnectSSE } = get();
    // إذا لم يكن هناك اتصال، قم بإعادة الاتصال
    if (!isConnected) {
      disconnectSSE();
      setupSSEConnection();
    }
  },
}));

export default useAccidentStore;

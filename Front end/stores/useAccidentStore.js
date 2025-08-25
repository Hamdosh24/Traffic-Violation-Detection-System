import { StandardApi } from "@/app/api/StandarApi";
import { create } from "zustand";

const useAccidentStore = create((set, get) => ({
  accidents: [],
  unviewedCount: 0,
  isLoading: false,
  error: null,
  sseConnection: null,
  // جلب جميع الحوادث
  fetchAccidents: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await StandardApi.fetchAllAccidents();
      if (result.success) {
        const accidentsData = result.data.data || [];
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
      const unviewedAccidents = get().accidents.filter((acc) => !acc.viewed);

      // إرسال طلبات لتحديث جميع الحوادث غير المشاهدة
      const updatePromises = unviewedAccidents.map((accident) =>
        StandardApi.markAccidentAsViewed(accident.id)
      );

      const results = await Promise.all(updatePromises);
      const allSuccess = results.every((result) => result.success);

      if (allSuccess) {
        set((state) => ({
          accidents: state.accidents.map((acc) => ({ ...acc, viewed: true })),
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
      set({ sseConnection: null });
    }
  },

  // إعداد اتصال SSE
  setupSSEConnection: () => {
    const cleanupSSE = get().cleanupSSE;
    cleanupSSE();

    get().fetchAccidents();

    const sseConnection = StandardApi.setupAccidentSSE((data) => {
      // التصحيح: استخدام بنية البيانات الصحيحة من الاستجابة
      const newAccident = {
        id: data.id,
        timestamp: data.timestamp,
        status: data.status,
        camera: data.camera,
      };

      set((state) => ({
        accidents: [newAccident, ...state.accidents],
        unviewedCount: state.unviewedCount + (data.status === "new" ? 1 : 0),
      }));
    });

    set({ sseConnection });
  },
}));

export default useAccidentStore;

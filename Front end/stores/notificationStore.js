import { StandardApi } from "@/app/api/StandarApi";
import { create } from "zustand";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  eventSource: null,
  countEventSource: null, // أضفنا مصدر منفصل لعداد الإشعارات
  isLoading: false,
  error: null,

  // جلب الإشعارات الأولية
  fetchInitialNotifications: async () => {
    try {
      const { success, data, error } = await StandardApi.fetchNewAccidents();
      if (!success) throw new Error(error || "Failed to fetch notifications");

      return data.map((accident) => ({
        id: accident.id,
        title: "حادث مروري",
        message: `تم اكتشاف حادث في ${
          accident.camera?.region || "موقع غير معروف"
        }`,
        date: accident.timestamp,
        isRead: accident.status !== "new",
        camera: {
          id: accident.camera?.camera_id || 0,
          governorate: accident.camera?.governorate || "",
          region: accident.camera?.region || "",
          street: accident.camera?.street || "",
          coordinates: accident.camera?.coordinates || "",
        },
        type: "accident",
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // إعداد اتصال SSE
  setupSSEConnection: async () => {
    try {
      set({ isLoading: true, error: null });
      get().cleanupSSE();

      // جلب الإشعارات الأولية
      const initialNotifications = await get().fetchInitialNotifications();
      set({
        notifications: initialNotifications,
        unreadCount: initialNotifications.filter((n) => !n.isRead).length,
      });

      // اتصال SSE للإشعارات الجديدة
      const accidentSSE = StandardApi.setupAccidentSSE((newAccident) => {
        const notification = {
          id: newAccident.id,
          title: "حادث مروري جديد",
          message: `تم اكتشاف حادث في ${
            newAccident.camera?.region || "موقع غير معروف"
          }`,
          date: newAccident.timestamp,
          isRead: false,
          camera: newAccident.camera || {},
          type: "accident",
        };

        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      });

      // اتصال SSE لعداد الإشعارات
      const countSSE = StandardApi.setupNotificationCountSSE((change) => {
        set((state) => ({
          unreadCount: Math.max(0, state.unreadCount + change),
        }));
      });

      set({
        eventSource: accidentSSE,
        countEventSource: countSSE,
      });
    } catch (err) {
      set({ error: err.message });
      console.error("SSE setup error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // تنظيف اتصالات SSE
  cleanupSSE: () => {
    if (get().eventSource) {
      get().eventSource.close();
    }
    if (get().countEventSource) {
      get().countEventSource.close();
    }
    set({
      eventSource: null,
      countEventSource: null,
    });
  },

  // باقي الدوال كما هي...
  markAsRead: async (id) => {
    try {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      }));

      const { success, error } = await StandardApi.markAccidentAsViewed(id);
      if (!success) throw new Error(error);
    } catch (err) {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: false } : n
        ),
        unreadCount: state.unreadCount + 1,
        error: err.message,
      }));
    }
  },

  markAllAsRead: async () => {
    try {
      const unreadIds = get()
        .notifications.filter((n) => !n.isRead)
        .map((n) => n.id);

      if (unreadIds.length === 0) return;

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));

      await Promise.all(
        unreadIds.map((id) => StandardApi.markAccidentAsViewed(id))
      );
    } catch (err) {
      set({ error: err.message });
      get().setupSSEConnection();
    }
  },
}));

export default useNotificationStore;

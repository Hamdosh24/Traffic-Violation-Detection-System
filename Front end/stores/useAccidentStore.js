// import { StandardApi } from "@/app/api/StandarApi";
// import { create } from "zustand";

// const useAccidentStore = create((set, get) => ({
//   accidents: [],
//   unviewedCount: 0,
//   isLoading: false,
//   error: null,
//   eventSource: null,
//   isConnected: false,

//   // جلب جميع الحوادث
//   fetchAccidents: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const result = await StandardApi.fetchAllAccidents();
//       if (result && result.success) {
//         const accidentsData = Array.isArray(result.data) ? result.data : [];
//         set({
//           accidents: accidentsData,
//           unviewedCount: accidentsData.filter(
//             (accident) => accident.status === "new"
//           ).length,
//         });
//       } else {
//         set({ error: (result && result.error) || "فشل في جلب الحوادث" });
//       }
//     } catch (error) {
//       set({ error: "حدث خطأ أثناء جلب الحوادث" });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // تعيين حادث كمشاهدة
//   markAsViewed: async (accidentId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const result = await StandardApi.markAccidentAsViewed(accidentId);
//       if (result && result.success) {
//         set((state) => {
//           const updatedAccidents = state.accidents.map((accident) =>
//             accident.id === accidentId
//               ? { ...accident, status: "acknowledged" }
//               : accident
//           );
//           return {
//             accidents: updatedAccidents,
//             unviewedCount: updatedAccidents.filter(
//               (acc) => acc.status === "new"
//             ).length,
//           };
//         });
//       } else {
//         set({ error: (result && result.error) || "فشل في تحديث حالة الحادث" });
//       }
//     } catch (error) {
//       set({ error: "حدث خطأ أثناء تحديث حالة الحادث" });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // تعيين جميع الحوادث كمشاهدة
//   markAllAsViewed: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const unviewedAccidents = get().accidents.filter(
//         (acc) => acc.status === "new"
//       );

//       if (unviewedAccidents.length === 0) {
//         set({ isLoading: false });
//         return;
//       }

//       const updatePromises = unviewedAccidents.map((accident) =>
//         StandardApi.markAccidentAsViewed(accident.id)
//       );

//       const results = await Promise.all(updatePromises);
//       const allSuccess = results.every((result) => result && result.success);

//       if (allSuccess) {
//         set((state) => ({
//           accidents: state.accidents.map((acc) =>
//             acc.status === "new" ? { ...acc, status: "acknowledged" } : acc
//           ),
//           unviewedCount: 0,
//         }));
//       } else {
//         set({ error: "فشل في تحديث بعض الحوادث" });
//       }
//     } catch (error) {
//       set({ error: "حدث خطأ أثناء تحديث الحوادث" });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // معالج لبيانات الحادث الجديد
//   handleNewAccident: (data) => {
//     try {
//       console.log("Processing new accident:", data);

//       const newAccident = {
//         id: data.id,
//         timestamp: data.timestamp,
//         status: data.status || "new",
//         camera: data.camera || {},
//       };

//       set((state) => ({
//         accidents: [newAccident, ...state.accidents],
//         unviewedCount:
//           state.unviewedCount + (newAccident.status === "new" ? 1 : 0),
//       }));

//       // إشعار بصوت عند وصول حادث جديد
//       if (newAccident.status === "new" && typeof window !== "undefined") {
//         try {
//           const audio = new Audio("/notification-sound.mp3");
//           audio.play().catch((e) => console.log("Cannot play sound:", e));
//         } catch (e) {
//           console.log("Sound notification error:", e);
//         }
//       }
//     } catch (error) {
//       console.error("Error processing new accident:", error, data);
//     }
//   },

//   setupSSEConnection: () => {
//     const { eventSource, reconnectAttempts, maxReconnectAttempts } = get();

//     // إذا تجاوزنا الحد الأقصى للمحاولات
//     if (reconnectAttempts >= maxReconnectAttempts) {
//       console.error("❌ Maximum reconnection attempts reached");
//       set({
//         error: "فشل في الاتصال بالخادم بعد عدة محاولات. يرجى تحديث الصفحة.",
//         isConnected: false,
//       });
//       return;
//     }

//     // إذا كان هناك اتصال قائم، لا تفعل شيئاً
//     if (eventSource) {
//       return;
//     }

//     const sse = StandardApi.setupAccidentSSE(
//       get().handleNewAccident,
//       // onOpen
//       () => {
//         set({
//           isConnected: true,
//           error: null,
//           reconnectAttempts: 0, // إعادة تعيين المحاولات عند الاتصال الناجح
//         });
//       },
//       // onError
//       (error) => {
//         console.error("SSE connection error:", error);
//         const currentAttempts = get().reconnectAttempts;
//         set({
//           isConnected: false,
//           error: "فشل في الاتصال بالخادم",
//           reconnectAttempts: currentAttempts + 1,
//         });

//         // إعادة الاتصال بعد تأخير (باستخدام exponential backoff)
//         const delay = Math.min(1000 * Math.pow(2, currentAttempts), 30000);
//         console.log(
//           `⏳ Attempting reconnect in ${delay}ms (attempt ${
//             currentAttempts + 1
//           }/${maxReconnectAttempts})`
//         );

//         setTimeout(() => {
//           if (!get().isConnected) {
//             get().reconnectSSE();
//           }
//         }, delay);
//       }
//     );

//     set({ eventSource: sse, isConnected: sse ? true : false });
//   },

//   reconnectSSE: () => {
//     const { isConnected, setupSSEConnection, disconnectSSE } = get();
//     if (!isConnected) {
//       disconnectSSE();
//       setupSSEConnection();
//     }
//   },

//   // فصل اتصال SSE
//   disconnectSSE: () => {
//     const { eventSource } = get();
//     if (eventSource) {
//       StandardApi.disconnectSSE(eventSource);
//       set({ eventSource: null, isConnected: false });
//     }
//   },
// }));

// export default useAccidentStore;

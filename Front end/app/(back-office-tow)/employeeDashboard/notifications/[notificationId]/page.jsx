// "use client";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";

// export default function NotificationDetails({ params }) {
//   const router = useRouter();
//   const [notification, setNotification] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotification = async () => {
//       try {
//         const response = await fetch(
//           `/api/notifications/${params.notificationId}`
//         );
//         const data = await response.json();
//         setNotification(data);
//       } catch (error) {
//         console.error("Failed to fetch notification:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotification();
//   }, [params.notificationId]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customGreen"></div>
//       </div>
//     );
//   }

//   if (!notification) {
//     return (
//       <div className="text-center py-10 text-red-500">الإشعار غير موجود</div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <button
//         onClick={() => router.back()}
//         className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
//       >
//         <ArrowLeft className="h-5 w-5 ml-1" />
//         العودة
//       </button>

//       <div className="bg-white dark:bg-customDarkGreen rounded-lg shadow p-6">
//         <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//           {notification.title}
//         </h1>
//         <div className="prose dark:prose-invert max-w-none">
//           <p className="text-gray-600 dark:text-gray-300">
//             {notification.message}
//           </p>
//           {notification.details && (
//             <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
//               {notification.details}
//             </div>
//           )}
//         </div>
//         <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
//           {new Date(notification.date).toLocaleString("ar-EG", {
//             day: "numeric",
//             month: "long",
//             year: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

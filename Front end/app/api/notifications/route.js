// import { NextResponse } from "next/server";

// let notifications = [
//   {
//     id: "1",
//     title: "طلب جديد",
//     message: "تم استلام طلب جديد من العميل أحمد محمد",
//     date: "2025-07-24T10:30:00Z",
//     isRead: false,
//     details: "رقم الطلب: #12345\nالخدمة: سحب مركبة\nالموقع: الرياض - حي العليا",
//   },
//   // يمكن إضافة المزيد من الإشعارات هنا...
// ];

// // الحصول على جميع الإشعارات
// export async function GET() {
//   return NextResponse.json(notifications);
// }

// // نقطة نهاية SSE للتحديثات الفورية
// export async function GET() {
//   const stream = new TransformStream();
//   const writer = stream.writable.getWriter();

//   // في الواقع الفعلي، سيتم إرسال التحديثات عند حدوث تغيير وليس بشكل دوري
//   const interval = setInterval(async () => {
//     const newNotification = {
//       id: Date.now().toString(),
//       title: "إشعار جديد",
//       message: "هذا إشعار تجريبي يتم إرساله كل 30 ثانية",
//       date: new Date().toISOString(),
//       isRead: false,
//       details: "تفاصيل الإشعار الجديد",
//     };

//     await writer.write(
//       new TextEncoder().encode(`data: ${JSON.stringify(newNotification)}\n\n`)
//     );
//   }, 30000);

//   // تنظيف عند إغلاق الاتصال
//   stream.readable.cancel().then(() => {
//     clearInterval(interval);
//   });

//   return new NextResponse(stream.readable, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       Connection: "keep-alive",
//       "Cache-Control": "no-cache",
//     },
//   });
// }

// // تعيين جميع الإشعارات كمقروءة
// export async function POST() {
//   notifications = notifications.map((n) => ({ ...n, isRead: true }));
//   return NextResponse.json({ success: true });
// }

// // الحصول على إشعار معين حسب ID
// export async function GET(request, { params }) {
//   const notification = notifications.find(
//     (n) => n.id === params.notificationId
//   );
//   if (!notification) {
//     return NextResponse.json(
//       { error: "Notification not found" },
//       { status: 404 }
//     );
//   }
//   return NextResponse.json(notification);
// }

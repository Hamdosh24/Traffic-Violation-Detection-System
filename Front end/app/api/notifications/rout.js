import { NextResponse } from "next/server";

// بيانات تجريبية للإشعارات
let notifications = [
  {
    id: "1",
    title: "طلب جديد",
    message: "تم استلام طلب جديد من العميل أحمد محمد",
    date: "2025-07-24T10:30:00Z",
    isRead: false,
    details: "رقم الطلب: #12345\nالخدمة: سحب مركبة\nالموقع: الرياض - حي العليا",
  },
  {
    id: "2",
    title: "تحديث حالة الطلب",
    message: "تم تحديث حالة الطلب #12345 إلى قيد التنفيذ",
    date: "2025-07-24T11:15:00Z",
    isRead: true,
    details: "الموعد المتوقع: 2025-07-25\nالفني: محمد علي",
  },
];

// نقطة النهاية الرئيسية
export function GET() {
  return NextResponse.json(notifications);
}

// نقطة نهاية SSE للتحديثات الفورية
export function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendNotification = async () => {
    const newNotification = {
      id: Date.now().toString(),
      title: "إشعار جديد",
      message: "هذا إشعار تجريبي يتم إرساله تلقائياً",
      date: new Date().toISOString(),
      isRead: false,
      details: "تفاصيل الإشعار الجديد",
    };

    notifications.unshift(newNotification);
    await writer.write(
      new TextEncoder().encode(`data: ${JSON.stringify(newNotification)}\n\n`)
    );
  };

  // إرسال إشعار كل 30 ثانية (في الواقع الفعلي سيتم إرساله عند حدوث حدث)
  const interval = setInterval(sendNotification, 30000);

  // تنظيف عند إغلاق الاتصال
  stream.readable.cancel().then(() => {
    clearInterval(interval);
  });

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    },
  });
}

// تعيين جميع الإشعارات كمقروءة
export async function POST() {
  notifications = notifications.map((n) => ({ ...n, isRead: true }));
  return NextResponse.json({ success: true });
}

// تعيين إشعار معين كمقروء
export async function POST(request) {
  const { id } = await request.json();
  notifications = notifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
  return NextResponse.json({ success: true });
}

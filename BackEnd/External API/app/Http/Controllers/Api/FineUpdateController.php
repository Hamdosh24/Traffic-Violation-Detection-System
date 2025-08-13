<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // استدعاء واجهة HTTP
use Illuminate\Support\Facades\Log;   // لتوثيق العمليات (اختياري)

class FineUpdateController extends Controller
{
    /**
     * يحاكي تحديث قيمة المخالفة ويرسل إشعارًا (Webhook) للنظام الداخلي.
     */
    public function triggerUpdate(Request $request)
    {
        // 1. التحقق من صحة البيانات المرسلة لهذا الرابط
        $validatedData = $request->validate([
            'key' => 'required|string',   // مفتاح المخالفة مثل 'no_seatbelt'
            'fine_amount' => 'required|numeric' // قيمة الغرامة الجديدة
        ]);

        // 2. تحديد رابط الـ Webhook في النظام الداخلي
        // في ملف FineUpdateController.php بالنظام الخارجي
        $internalSystemWebhookUrl = 'http://127.0.0.1:8000/api/webhook/fine-updated';

        // 3. تجهيز البيانات التي سيتم إرسالها
        $payload = [
            'key' => $validatedData['key'],
            'fine_amount' => $validatedData['fine_amount']
        ];

        // 4. إرسال طلب POST إلى النظام الداخلي
        try {
            $response = Http::post($internalSystemWebhookUrl, $payload);

            // التحقق من نجاح الإرسال
            if ($response->successful()) {
                Log::info("Webhook sent successfully for key: {$payload['key']}");
                return response()->json([
                    'message' => 'Notification sent successfully to the internal system.',
                    'data' => $payload
                ], 200);
            } else {
                // في حال فشل النظام الداخلي في الاستجابة بشكل صحيح
                Log::error("Failed to send webhook for key: {$payload['key']}. Status: " . $response->status());
                return response()->json([
                    'message' => 'The internal system responded with an error.',
                    'status_code' => $response->status()
                ], 502); // Bad Gateway
            }

        } catch (\Exception $e) {
            // في حال فشل الاتصال بالنظام الداخلي
            
            Log::error("Could not connect to the internal system: " . $e->getMessage());
            return response()->json([
                'message' => 'Could not connect to the internal system.'
            ], 504); // Gateway Timeout
        }
    }
}
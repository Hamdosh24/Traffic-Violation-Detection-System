<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ViolationType; // استدعاء المودل الخاص بجدول أنواع المخالفات
use Illuminate\Support\Facades\Log; // لاستخدام اللوقات لتسجيل العمليات

class WebhookController extends Controller
{
    /**
     * يستقبل تحديثات قيمة الغرامة من النظام الخارجي عبر Webhook.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleFineUpdate(Request $request)
    {
        // 1. التحقق من صحة البيانات القادمة من النظام الخارجي
        $validatedData = $request->validate([
            'key' => 'required|string|max:255',
            'fine_amount' => 'required|numeric|min:0',
        ]);

        // 2. البحث عن نوع المخالفة في قاعدة البيانات باستخدام الـ key
        $violationType = ViolationType::where('key', $validatedData['key'])->first();

        if ($violationType) {
            // 3. إذا تم العثور على المخالفة، قم بتحديث قيمة الغرامة
            $violationType->fine_amount = $validatedData['fine_amount'];
            $violationType->save();

            // تسجيل العملية في اللوق (ممارسة جيدة)
            Log::info("Webhook: Fine amount for key '{$validatedData['key']}' was updated to {$validatedData['fine_amount']}.");

            // 4. إرجاع رسالة نجاح
            return response()->json([
                'status' => 'success',
                'message' => 'Violation fine amount updated successfully.'
            ], 200);

        } else {
            // 5. في حال لم يتم العثور على الـ key، قم بتسجيل ذلك وإرجاع خطأ
            Log::warning("Webhook: Received update for a non-existent violation key: '{$validatedData['key']}'.");

            return response()->json([
                'status' => 'error',
                'message' => 'Violation key not found.'
            ], 404); // 404 Not Found
        }
    }
}
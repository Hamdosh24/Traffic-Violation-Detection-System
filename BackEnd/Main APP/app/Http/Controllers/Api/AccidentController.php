<?php

namespace App\Http\Controllers\Api;

use App\Events\AccidentAcknowledged;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAccidentRequest;
use App\Http\Resources\AccidentResource;
use App\Models\Accident;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AccidentController extends Controller
{
    /**
     * Store a newly created accident in storage.
     */
    public function store(StoreAccidentRequest $request): JsonResponse
    {
        try {
            // الخطوة 1: إنشاء الحادث فقط.
            // الـ Observer سيتولى بقية العملية تلقائيًا (إطلاق الحدث).
            $accident = Accident::create($request->validated());

            return response()->json([
                'message' => 'Accident recorded successfully.',
                'id' => $accident->id,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to record accident: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to record accident.'], 500);
        }
    }

    /**
     * Mark an accident as acknowledged by an employee.
     */
    public function acknowledge(Request $request, Accident $accident): JsonResponse
    {
        // استخدام تحديث ذري لمنع أكثر من موظف من متابعة نفس الحادث
        $updatedRows = Accident::where('id', $accident->id)
            ->where('status', 'new') // شرط حيوي لضمان أن الحادث لم يتم متابعته
            ->update([
                'status' => 'acknowledged',
                'claimed_by' => $request->user()->id, // استخدام ID المستخدم المصادق عليه
                'claimed_at' => now(),
            ]);

        // إذا لم يتم تحديث أي صف، فهذا يعني أن موظفًا آخر قد سبقه
        if ($updatedRows === 0) {
            return response()->json(['message' => 'This accident has already been handled.'], 409); // 409 Conflict
        }

        // جلب الحادث بعد تحديثه للحصول على البيانات الجديدة
        $updatedAccident = $accident->fresh();

        // بث حدث "متابعة حادث" إلى جميع المستخدمين الآخرين
        broadcast(new AccidentAcknowledged($updatedAccident))->toOthers();

        return response()->json([
            'data' => new AccidentResource($updatedAccident),
        ]);
    }

    /**
     * Stream new and acknowledged accidents in real-time using SSE.
     */
    public function streamNewAccidents(Request $request): StreamedResponse
    {
        $response = new StreamedResponse(function () {
            set_time_limit(0);
            try {
                // الاشتراك في قناة Redis. هذه عملية مستمرة وتبقي الاتصال مفتوحًا
                Redis::psubscribe(['accidents-channel'], function ($message, $channel) {
                    $decodedMessage = json_decode($message, true);
                    $eventName = $decodedMessage['event'] ?? 'message';
                    $data = json_encode($decodedMessage['data']);

                    // إرسال البيانات بصيغة SSE إلى العميل
                    echo "event: {$eventName}\n";
                    echo "data: {$data}\n\n";

                    // تفريغ المخزن المؤقت (buffer) لضمان الإرسال الفوري
                    ob_flush();
                    flush();
                });
            } catch (\Exception $e) {
                // تسجيل أي خطأ يحدث أثناء اتصال Redis
                Log::error('SSE Redis Subscription Error: ' . $e->getMessage());
                echo "event: error\n";
                echo 'data: {"message": "Stream connection lost."}' . "\n\n";
                ob_flush();
                flush();
            }
        });

        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Cache-Control', 'no-cache');
        return $response;
    }

    /**
     * Display a paginated listing of the resource.
     */
    public function indexAll(Request $request)
    {
        $recentAccidents = Accident::with('camera')
            ->where('timestamp', '>=', now()->subHours(24))
            ->latest('timestamp') // الأفضل تحديد الحقل للترتيب
            ->paginate(20); // استخدام paginate للأداء

        return AccidentResource::collection($recentAccidents);
    }
}
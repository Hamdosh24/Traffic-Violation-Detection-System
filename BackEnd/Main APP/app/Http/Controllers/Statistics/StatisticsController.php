<?php

namespace App\Http\Controllers\Statistics;

use App\Http\Controllers\Controller;
use App\Models\Accident;
use App\Models\ActivityLog;
use App\Models\Violation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class StatisticsController extends Controller
{
    public function getDataByHour(Request $request)
    {
        try {
            $validated = $request->validate([
                'type_name' => 'required|string',
                'governorate' => 'required|string',
                'region' => 'required|string',
                'from_date' => 'required|date',
                'to_date' => 'required|date',
            ]);

            $isAccident = strtolower($validated['type_name']) === 'حوادث';
            $baseModel = $isAccident ? new Accident : new Violation;
            $tableName = $baseModel->getTable();

            // ضبط بداية ونهاية اليوم
            $from = \Carbon\Carbon::parse($validated['from_date'])->startOfDay();
            $to = \Carbon\Carbon::parse($validated['to_date'])->endOfDay();

            // حساب عدد الأيام بين تاريخين، شامل اليوم الأخير
            $days = $from->diffInDays($to) + 1;

            // بناء الاستعلام
            if (! $isAccident) {
                $query = $baseModel::query()
                    ->join('violation_types', "$tableName.v_type_id", '=', 'violation_types.v_type_id')
                    ->join('cameras', "$tableName.camera_id", '=', 'cameras.camera_id')
                    ->whereBetween("$tableName.timestamp", [$from, $to]);

                if (strtolower($validated['type_name']) !== 'كل المخالفات') {
                    $query->where('violation_types.type_name', $validated['type_name']);
                }
            } else {
                $query = $baseModel::query()
                    ->join('cameras', "$tableName.camera_id", '=', 'cameras.camera_id')
                    ->whereBetween("$tableName.timestamp", [$from, $to]);
            }

            if (strtolower($validated['governorate']) !== 'كل المحافظات') {
                $query->where('cameras.governorate', $validated['governorate']);
            }

            if (strtolower($validated['region']) !== 'كل المناطق') {
                $query->where('cameras.region', $validated['region']);
            }

            // جلب البيانات مجمعة حسب الساعة
            $violations = $query->select(
                DB::raw("HOUR($tableName.timestamp) as hour"),
                DB::raw('COUNT(*) as count')
            )
                ->groupBy('hour')
                ->orderBy('hour')
                ->get();

            // تهيئة مصفوفة الساعات
            $result = [];
            for ($i = 0; $i < 24; $i++) {
                $next = ($i + 1) % 24; // % 24: لضمان أن الساعة الأخيرة 23 تليها 0
                $label = $i.'-'.$next;
                $result[$label] = 0;
            }

            // تعبئة المتوسط لكل ساعة
            foreach ($violations as $v) {
                $next = ($v->hour + 1) % 24;
                $label = $v->hour.'-'.$next;
                $result[$label] = round($v->count / $days, 2); // حساب المتوسط اليومي لكل ساعة وتقريبه لخانتين عشريتين
            }

            ActivityLog::create([
                'user_id' => Auth::user()->user_id ?? null,
                'action_type' => 'عرض الاحصاءات',
                'description' => "عرض إحصاءات {$validated['type_name']} (كمعدل يومي) حسب ساعات اليوم في {$validated['region']},{$validated['governorate']} من تاريخ {$validated['from_date']} إلى تاريخ {$validated['to_date']}",
                'model_type' => 'Violation | Accident',
                'model_id' => null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'status' => true,
                'data' => $result,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'فشل التحقق من البيانات.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(), // مؤقتاً لعرض الخطأ الحقيقي أثناء التجربة
            ], 500);
        }
    }

    public function getDataByRegion(Request $request)
    {
        try {
            $validated = $request->validate([
                'type_name' => 'required|string',
                'governorate' => 'required|string',
                'from_date' => 'required|date',
                'to_date' => 'required|date',
            ]);

            $isAccident = strtolower($validated['type_name']) === 'حوادث';

            $baseModel = $isAccident ? new Accident : new Violation;
            $tableName = $baseModel->getTable();

            // ضبط نطاق التاريخ ليشمل كامل اليوم
            $from = \Carbon\Carbon::parse($validated['from_date'])->startOfDay();
            $to = \Carbon\Carbon::parse($validated['to_date'])->endOfDay();

            if (! $isAccident) {
                $query = $baseModel::query()
                    ->join('violation_types', "$tableName.v_type_id", '=', 'violation_types.v_type_id')
                    ->join('cameras', "$tableName.camera_id", '=', 'cameras.camera_id')
                    ->whereBetween("$tableName.timestamp", [$from, $to]);

                if (strtolower($validated['type_name']) !== 'كل المخالفات') {
                    $query->where('violation_types.type_name', $validated['type_name']);
                }
            } else {
                $query = $baseModel::query()
                    ->join('cameras', "$tableName.camera_id", '=', 'cameras.camera_id')
                    ->whereBetween("$tableName.timestamp", [$from, $to]);
            }

            if (strtolower($validated['governorate']) !== 'كل المحافظات') {
                $query->where('cameras.governorate', $validated['governorate']);
            }

            // جلب البيانات مجمعة حسب المنطقة
            $violationsByRegion = $query->select(
                'cameras.region',
                DB::raw('COUNT(*) as count')
            )
                ->groupBy('cameras.region')
                ->orderBy('cameras.region')
                ->get();

            // تجهيز البيانات للإرجاع
            $result = [];
            foreach ($violationsByRegion as $item) {
                $result[] = [
                    'region' => $item->region,
                    'count' => $item->count,
                ];
            }

            // إذا كانت النتيجة فارغة، ضع القيمة الافتراضية
            if (empty($result)) {
                $result[] = [
                    'region' => 'كل المناطق',
                    'count' => 0,
                ];
            }

            ActivityLog::create([
                'user_id' => Auth::user()->user_id ?? null,
                'action_type' => 'عرض الاحصاءات',
                'description' => "عرض إحصاءات {$validated['type_name']} حسب توزعها في المناطق من تاريخ {$validated['from_date']} إلى تاريخ {$validated['to_date']}",
                'model_type' => 'Violation | Accident',
                'model_id' => null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'status' => true,
                'data' => $result,
            ]);

        } catch (ValidationException $e) {
            Log::error('فشل التحقق من البيانات: '.json_encode($e->errors()));

            return response()->json([
                'status' => false,
                'message' => 'فشل التحقق من البيانات.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('خطأ في getViolationsByRegion: '.$e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'حدث خطأ أثناء معالجة الطلب.',
            ], 500);
        }
    }
}

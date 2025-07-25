<?php

namespace App\Http\Controllers\Statistics;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Violation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException; // تأكد من استيرادها أعلى الملف
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class StatisticsController extends Controller
{
    public function getViolationsByHour(Request $request)
    {
        try {
            $validated = $request->validate([
                'type_name'   => 'required|string',
                'governorate' => 'required|string',
                'region'      => 'required|string',
                'from_date'   => 'required|date',
                'to_date'     => 'required|date',
            ]);

            // الاستعلام مع joins
            $query = Violation::query()
                ->join('violation_types', 'violations.v_type_id', '=', 'violation_types.v_type_id')
                ->join('cameras', 'violations.camera_id', '=', 'cameras.camera_id')
                ->whereBetween('violations.created_at', [$validated['from_date'], $validated['to_date']]);

            if (strtolower($validated['type_name']) !== 'all') {
                $query->where('violation_types.type_name', $validated['type_name']);
            }

            if (strtolower($validated['governorate']) !== 'all') {
                $query->where('cameras.governorate', $validated['governorate']);
            }

            if (strtolower($validated['region']) !== 'all') {
                $query->where('cameras.region', $validated['region']);
            }

            // تجميع البيانات حسب الساعة
            $violations = $query->select(
                    DB::raw('HOUR(violations.created_at) as hour'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('hour')
                ->orderBy('hour')
                ->get();

            // تجهيز هيكل البيانات لجميع الساعات
            $result = [];

            for ($i = 0; $i < 24; $i++) {
                $next = ($i + 1) % 24;
                $label = $i . '-' . $next;
                $result[$label] = 0;
            }

            foreach ($violations as $v) {
                $next = ($v->hour + 1) % 24;
                $label = $v->hour . '-' . $next;
                $result[$label] = $v->count;
            }

            ActivityLog::create([
                'user_id'     => Auth::user()->user_id ?? null, // null لو لم يكن مستخدم مسجل
                'action_type' => 'Statistics Query',
                'description' => 'Retrieved violations by hour statistics.',
                'model_type'  => 'Violation',
                'model_id'    => null, // لا يرتبط بسجل محدد هنا
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            return response()->json([
                'status' => true,
                'data' => $result,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'errors' => $e->errors(),
            ], 422);
        }
    }



public function getViolationsByRegion(Request $request)
{
    Log::info('AAA');
    try {
        $validated = $request->validate([
            'type_name' => 'required|string',
            'from_date' => 'required|date',
            'to_date'   => 'required|date',
        ]);

        Log::info('BBB');

        // بناء الاستعلام
        $query = Violation::query()
            ->join('violation_types', 'violations.v_type_id', '=', 'violation_types.v_type_id')
            ->join('cameras', 'violations.camera_id', '=', 'cameras.camera_id')
            ->whereBetween('violations.created_at', [$validated['from_date'], $validated['to_date']]);

        if (strtolower($validated['type_name']) !== 'all') {
            $query->where('violation_types.type_name', $validated['type_name']);
        }

        // تحديد عدد المخالفات لكل منطقة
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
                'count'  => $item->count,
            ];
        }

        ActivityLog::create([
            'user_id'     => Auth::user()->user_id ?? null, // null لو لم يكن مستخدم مسجل
            'action_type' => 'Statistics Query',
            'description' => 'Retrieved violations by region statistics.',
            'model_type'  => 'Violation',
            'model_id'    => null, // لا يرتبط بسجل محدد هنا
            'ip_address'  => $request->ip(),
            'user_agent'  => $request->userAgent(),
        ]);

        return response()->json([
            'status' => true,
            'data'   => $result,
        ]);
    } catch (ValidationException $e) {
        Log::error('Validation failed: ' . json_encode($e->errors()));
        return response()->json([
            'status' => false,
            'errors' => $e->errors(),
        ], 422);
    }
}
}
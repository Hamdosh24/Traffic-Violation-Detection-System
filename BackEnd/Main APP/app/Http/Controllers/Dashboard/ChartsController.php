<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Accident;
use App\Models\Violation;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class ChartsController extends Controller
{
    // 1. دونات المخالفات
    public function getViolationsDonutChart()
    {
        try {
            $startOfMonth = Carbon::now()->subDays(30);
            $endOfMonth = Carbon::now();

            $violations = Violation::select('v_type_id', DB::raw('count(*) as total'))
                ->whereBetween('timestamp', [$startOfMonth, $endOfMonth])
                ->groupBy('v_type_id')
                ->with('violationType')
                ->get();

            $total = $violations->sum('total');

            $result = $violations->map(function ($violation) use ($total) {
                return [
                    'type' => $violation->violationType->type_name ?? 'غير معروف',
                    'percentage' => round(($violation->total / $total) * 100, 2),
                ];
            });

            return response()->json($result);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ أثناء جلب بيانات مخطط الدونات للمخالفات',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // 2. خط زمني للمخالفات
    public function getViolationsTrendLine()
    {
        try {
            $startDate = Carbon::now()->subDays(29)->startOfDay(); // 30 يوم شامل اليوم
            $endDate = Carbon::now()->endOfDay();

            // جلب بيانات المخالفات من قاعدة البيانات مع تحويلها إلى مصفوفة date => total
            $violations = Violation::select(
                DB::raw('DATE(timestamp) as date'),
                DB::raw('count(*) as total')
            )
                ->whereBetween('timestamp', [$startDate, $endDate])
                ->groupBy(DB::raw('DATE(timestamp)'))
                ->orderBy('date')
                ->pluck('total', 'date');

            // إنشاء مصفوفة لجميع الأيام الـ 30
            $trendData = [];
            $currentDate = $startDate->copy();

            while ($currentDate->lte($endDate)) {
                $dateStr = $currentDate->toDateString();
                $trendData[] = [
                    'date' => $dateStr,
                    'total' => $violations[$dateStr] ?? 0,
                ];
                $currentDate->addDay();
            }

            return response()->json($trendData);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ أثناء جلب بيانات خط الزمن للمخالفات',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // 3. خط زمني للحوادث
    public function getAccidentsTrendLine()
    {
        try {
            $startDate = Carbon::now()->subDays(29)->startOfDay();
            $endDate = Carbon::now()->endOfDay();

            // جلب بيانات الحوادث من قاعدة البيانات
            $accidents = Accident::select(
                DB::raw('DATE(timestamp) as date'),
                DB::raw('count(*) as total')
            )
                ->whereBetween('timestamp', [$startDate, $endDate])
                ->groupBy(DB::raw('DATE(timestamp)'))
                ->orderBy('date')
                ->pluck('total', 'date'); // يرجع [ '2025-08-10' => 5, ...]

            // إنشاء مصفوفة لجميع الأيام الـ 30
            $trendData = [];
            $currentDate = $startDate->copy();

            while ($currentDate->lte($endDate)) {
                $dateStr = $currentDate->toDateString();
                $trendData[] = [
                    'date' => $dateStr,
                    'total' => $accidents[$dateStr] ?? 0,
                ];
                $currentDate->addDay();
            }

            return response()->json($trendData);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ أثناء جلب بيانات خط الزمن للحوادث',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}

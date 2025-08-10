<?php
namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Violation;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;

class ChartsController extends Controller
{
    // 1. دونات المخالفات
    public function getViolationsDonutChart()
    {
        try {
            $startOfMonth = Carbon::now()->copy()->startOfMonth();
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
                    'percentage' => round(($violation->total / $total) * 100, 2)
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
            $startDate = Carbon::now()->subDays(30);
            $endDate = Carbon::now();

            $data = Violation::select(
                    DB::raw("DATE(timestamp) as date"),
                    DB::raw("count(*) as total")
                )
                ->whereBetween('timestamp', [$startDate, $endDate])
                ->groupBy(DB::raw("DATE(timestamp)"))
                ->orderBy('date')
                ->get();

            return response()->json($data);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ أثناء جلب بيانات خط الزمن للمخالفات',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

}

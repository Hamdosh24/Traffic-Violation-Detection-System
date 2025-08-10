<?php
namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Violation;
use App\Models\Accident;
use App\Models\Camera;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class BasicInfosController extends Controller
{
    public function getDashboardInfo()
    {
        try {
            $startOfMonth = Carbon::now()->subDays(30);
            $endOfMonth = Carbon::now();

            // 1. عدد المخالفات هذا الشهر
            $violationsCount = Violation::whereBetween('timestamp', [$startOfMonth, $endOfMonth])->count();

            // 2. عدد الحوادث هذا الشهر
            $accidentsCount = Accident::whereBetween('timestamp', [$startOfMonth, $endOfMonth])->count();

            // 3. عدد الكاميرات الكلي في النظام
            $totalCameras = Camera::count();

            // 4. أكثر نوع مخالفة شيوعًا هذا الشهر
            $maxCount = Violation::whereBetween('timestamp', [$startOfMonth, $endOfMonth])
                ->select('v_type_id', DB::raw('count(*) as total'))
                ->groupBy('v_type_id')
                ->orderByDesc('total')
                ->limit(1)
                ->pluck('total')
                ->first();

            if ($maxCount === null) 
            {
                $mostCommonViolations = collect();
            } 
            else 
            {
                $mostCommonViolations = Violation::whereBetween('timestamp', [$startOfMonth, $endOfMonth])
                    ->select('v_type_id', DB::raw('count(*) as total'))
                    ->groupBy('v_type_id')
                    ->havingRaw('count(*) = ?', [$maxCount])
                    ->with('violationType')
                    ->get();
            }
            $mostCommonViolationNames = $mostCommonViolations->pluck('violationType.type_name')->implode(', ');

            return response()->json([
                'violations_this_month' => $violationsCount,
                'accidents_this_month' => $accidentsCount,
                'most_common_violation' => $mostCommonViolationNames ?: 'لا يوجد بيانات',
                'total_cameras' => $totalCameras,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ أثناء جلب معلومات اللوحة',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    
    public function topAccidentStreets()
    {
        try {
            $startOfMonth = Carbon::now()->subDays(30);
            $endOfMonth = Carbon::now();

            // ننضم جدول الكاميرات مع الحوادث لأن الحوادث مخزنة مع camera_id فقط
            $topStreets = DB::table('accidents')
                ->join('cameras', 'accidents.camera_id', '=', 'cameras.camera_id')
                ->select(
                    'cameras.street',
                    'cameras.region',
                    'cameras.governorate',
                    DB::raw('count(accidents.id) as accident_count')
                )
                ->whereBetween('accidents.timestamp', [$startOfMonth, $endOfMonth])
                ->groupBy('cameras.street', 'cameras.region', 'cameras.governorate')
                ->orderByDesc('accident_count')
                ->limit(4)
                ->get();

            // صياغة النتائج بالشكل المطلوب
            $result = $topStreets->map(function($item) {
                return [
                    'street_name' => $item->street,
                    'region_governorate' => $item->region . ', ' . $item->governorate,
                    'accident_count' => $item->accident_count,
                ];
            });

            return response()->json($result);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'حدث خطأ أثناء جلب بيانات الشوارع',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}

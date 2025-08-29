<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Accident;
use App\Models\Violation;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function getByDate(Request $request)
    {
        try {
            $validated = $request->validate([
                'type_name'   => 'required|string',
                'governorate' => 'nullable|string',
                'region'      => 'nullable|string',
                'from_date'   => 'nullable|date',
                'to_date'     => 'nullable|date',
            ]);

            $isAccident = strtolower($validated['type_name']) === 'حوادث';
            $baseModel  = $isAccident ? new Accident : new Violation;
            $tableName  = $baseModel->getTable();

            $from = !empty($validated['from_date'])
                ? Carbon::parse($validated['from_date'])->startOfDay()
                : Carbon::now()->subDays(30)->startOfDay();

            $to = !empty($validated['to_date'])
                ? Carbon::parse($validated['to_date'])->endOfDay()
                : Carbon::now()->endOfDay();

            $query = $baseModel::query()
                ->join('cameras', "$tableName.camera_id", '=', 'cameras.camera_id')
                ->whereBetween("$tableName.timestamp", [$from, $to]);

            if (! $isAccident) 
            {
                $query->join('violation_types', "$tableName.v_type_id", '=', 'violation_types.v_type_id');

                if (strtolower($validated['type_name']) !== 'كل المخالفات') {
                    $query->where('violation_types.type_name', $validated['type_name']);
                }

                $query->select(
                    "$tableName.v_id as id",
                    "$tableName.camera_id",
                    "$tableName.plate_num",
                    "$tableName.timestamp",
                    'violation_types.type_name',
                    'cameras.governorate',
                    'cameras.region',
                    'cameras.street'
                );
            } 
            else 
            {
                $query->select(
                    "$tableName.id",
                    "$tableName.camera_id",
                    DB::raw('NULL as plate_num'),
                    "$tableName.timestamp",
                    DB::raw('NULL as type_name'),
                    'cameras.governorate',
                    'cameras.region',
                    'cameras.street'
                );
            }

            $records = $query->orderBy("$tableName.timestamp", 'desc')->get();

            ActivityLog::create([
                'user_id'     => Auth::user()->user_id ?? null,
                'action_type' => 'عرض سجل المخالفات و الحوادث',
                'description' => "عرض بيانات {$validated['type_name']} من {$from->toDateString()} إلى {$to->toDateString()}",
                'model_type'  => 'Violation | Accident',
                'model_id'    => null,
                'ip_address'  => $request->ip(),
                'user_agent'  => $request->userAgent(),
            ]);

            return response()->json([
                'status' => true,
                'data'   => $records,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status'  => false,
                'message' => 'فشل التحقق من البيانات.',
                'errors'  => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}

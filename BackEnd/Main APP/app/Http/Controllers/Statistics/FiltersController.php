<?php

namespace App\Http\Controllers\Statistics;

use App\Http\Controllers\Controller;

use App\Models\Camera;
use App\Models\ViolationType;

class FiltersController extends Controller
{
    public function getViolationsByHour()
    {
        $regions = Camera::select('region')->distinct()->pluck('region');

        $governorates = Camera::select('governorate')->distinct()->pluck('governorate');

        $violationTypes = ViolationType::select('type_name')->get()->pluck('type_name');

        return response()->json([
            'regions' => $regions,
            'governorates' => $governorates,
            'violation_types' => $violationTypes,
        ]);
    }


    public function getViolationsByRegion()
    {
        $violationTypes = ViolationType::select('type_name')->get()->pluck('type_name');

        return response()->json([
            'violation_types' => $violationTypes,
        ]);
    }
}

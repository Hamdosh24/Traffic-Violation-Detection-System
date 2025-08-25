<?php

namespace App\Http\Controllers\Statistics;

use App\Http\Controllers\Controller;
use App\Models\Camera;
use App\Models\ViolationType;

class FiltersController extends Controller
{
    public function getDataByHour()
    {
        $regions = Camera::select('region')->distinct()->pluck('region');
        $regions->prepend('كل المناطق');
        $governorates = Camera::select('governorate')->distinct()->pluck('governorate');
        $governorates->prepend('كل المحافظات');

        $violationTypes = ViolationType::select('type_name')->get()->pluck('type_name');
        $violationTypes->prepend('كل المخالفات');

        return response()->json([
            'regions' => $regions,
            'governorates' => $governorates,
            'violation_types' => $violationTypes,
        ]);
    }

    public function getDataByRegion()
    {
        $governorates = Camera::select('governorate')->distinct()->pluck('governorate');
        $governorates->prepend('كل المحافظات');

        $violationTypes = ViolationType::select('type_name')->get()->pluck('type_name');
        $violationTypes->prepend('كل المخالفات');

        return response()->json([
            'governorates' => $governorates,
            'violation_types' => $violationTypes,
        ]);
    }
}

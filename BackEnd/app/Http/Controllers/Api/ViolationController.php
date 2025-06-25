<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Violation;
use App\Models\ViolationType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ViolationController extends Controller
{
    /**
     * Store a newly created violation in storage.
     */
    public function store(Request $request)
    {
        // 1. التحقق من صحة البيانات الواردة
        $validator = Validator::make($request->all(), [
            'violation_type_key' => 'required|string|exists:violation_types,key',
            'plate_number' => 'required|string|max:255',
            'timestamp' => 'required|date',
            'camera_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. البحث عن نوع المخالفة للحصول على الـ ID الخاص به
        $violationType = ViolationType::where('key', $request->violation_type_key)->first();

        // 3. إنشاء سجل المخالفة الجديد
        $violation = Violation::create([
            'v_type_id' => $violationType->v_type_id,
            'camera_id' => $request->camera_id,
            'plate_num' => $request->plate_number,
            'timestamp' => $request->timestamp,
        ]);

        // 4. إرجاع استجابة ناجحة مع بيانات المخالفة التي تم إنشاؤها
        return response()->json($violation, 201);
    }
}
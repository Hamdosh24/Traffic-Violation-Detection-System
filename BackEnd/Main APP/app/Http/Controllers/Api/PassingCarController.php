<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PassingCar; // سنقوم بإنشاء هذا المودل في الخطوة التالية
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PassingCarController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. التحقق من صحة البيانات الواردة
        $validator = Validator::make($request->all(), [
            'plate_num' => 'required|string|max:255',
            'camera_id' => 'required|string|max:255',
            'timestamp' => 'required|date',
        ]);

        // في حال فشل التحقق، أرجع رسالة خطأ
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. إنشاء سجل مرور السيارة الجديد
        // نصيحة احترافية: استخدام validator->validated() يمرر فقط البيانات التي تم التحقق من صحتها
        $passingCar = PassingCar::create($validator->validated());

        // 3. إرجاع استجابة ناجحة مع بيانات السجل الذي تم إنشاؤه
        return response()->json($passingCar, 201);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accident;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AccidentController extends Controller
{
    /**
     * Store a newly created accident in storage.
     */
    public function store(Request $request)
    {
        // التحقق من صحة البيانات الواردة مع الهيكل الجديد
        $validator = Validator::make($request->all(), [
            'camera_id' => 'required|string|max:255',
            'timestamp' => 'required|date',
            'involved_vehicles' => 'required|array', // يجب أن يكون مصفوفة
            'involved_vehicles.*.type' => 'required|string', // يجب أن يحتوي كل عنصر على 'type'
            'involved_vehicles.*.identifier' => 'required|string', // يجب أن يحتوي كل عنصر على 'identifier'
        ]);

        // في حال فشل التحقق، أرجع رسالة خطأ
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // إنشاء سجل الحادث الجديد
        $accident = Accident::create($validator->validated());

        // إرجاع استجابة ناجحة
        return response()->json($accident, 201);
    }
}
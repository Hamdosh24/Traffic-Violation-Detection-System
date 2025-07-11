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
        // التحقق من صحة البيانات الواردة بعد التبسيط
        $validator = Validator::make($request->all(), [
            'camera_id' => 'required|string|max:255',
            'timestamp' => 'required|date',
        ]);

        // في حال فشل التحقق، أرجع رسالة خطأ
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // إنشاء سجل الحادث الجديد بالبيانات التي تم التحقق منها فقط
        $accident = Accident::create($validator->validated());

        // إرجاع استجابة ناجحة
        return response()->json($accident, 201);
    }

      public function indexNew()
    {
        // ابحث عن كل الحوادث التي حالتها 'new'
        $newAccidents = Accident::where('status', 'new')->latest()->get();

        // أرجعها كاستجابة JSON
        return response()->json($newAccidents);
    }

    public function markAsViewed(Accident $accident)
    {
        // نقوم بتحديث حقل الحالة فقط
        $accident->status = 'viewed';
        $accident->save();

        // نرجع استجابة ناجحة مع بيانات الحادث المحدثة
        return response()->json($accident);
    }
}
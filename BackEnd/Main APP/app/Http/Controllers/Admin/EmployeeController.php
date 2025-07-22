<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    //  عرض جميع الموظفين
    public function index()
    {
        $employees = User::with('roles')->get();
        return response()->json($employees);
    }

    //  إضافة موظف جديد
    public function store(Request $request)
    {
        try {
            $request->validate([
                // 'user_id' => 'required|unique:users,user_id',
                'user_name' => 'required',
                'national_num' => 'required',
                'password' => 'required',
                'first_name' => 'required',
                'last_name' => 'required',
                'phone_num' => 'required',
                'email' => 'required|email',
                'age' => 'required|integer',
                'gender' => 'required|in:male,female',
                'role_id' => 'required|exists:roles,role_id',
            ]);

            $employee = User::create([
                // 'user_id' => $request->user_id,
                'user_name' => $request->user_name,
                'national_num' => $request->national_num,
                'password' => Hash::make($request->password),
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone_num' => $request->phone_num,
                'email' => $request->email,
                'age' => $request->age,
                'gender' => $request->gender,
            ]);

            
            // ربط role بالموظف
            $employee->roles()->attach($request->role_id);

            return response()->json(['message' => 'Employee created successfully', 'employee' => $employee]);
        } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
    }

    //  عرض موظف محدد بالتفصيل
    public function show($user_id)
    {
        $employee = User::with('roles')->findOrFail($user_id);
        return response()->json($employee);
    }


    //  تعديل بيانات موظف
    public function update(Request $request, $user_id)
    {
        $employee = User::findOrFail($user_id);

        $employee->update($request->only([
            'user_name',
            'national_num',
            'first_name',
            'last_name',
            'phone_num',
            'email',
            'age',
            'gender',
        ]));

        if($request->password){
            $employee->password = Hash::make($request->password);
            $employee->save();
        }
        if($request->role_id){
            // تحديث الدور الحالي للموظف واستبداله بالدور الجديد
            $employee->roles()->sync([$request->role_id]);
        }


        return response()->json(['message' => 'Employee updated successfully', 'employee' => $employee]);
    }

    //  حذف موظف
    public function destroy($user_id)
    {
        $employee = User::findOrFail($user_id);
        $employee->roles()->detach();
        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully']);
    }
}
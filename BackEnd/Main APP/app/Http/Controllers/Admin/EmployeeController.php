<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request; // استدعاء موديل activity log
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    //  عرض جميع الموظفين
    public function index()
    {
        try {
            // $employees = User::with('roles')->get();

            $employees = User::with('roles')->get()->map(function ($user) {
                $role = $user->roles->first(); // أخذ أول دور فقط

                return [
                    'user_id' => $user->user_id,
                    'user_name' => $user->user_name,
                    'national_num' => $user->national_num,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'phone_num' => $user->phone_num,
                    'email' => $user->email,
                    'age' => $user->age,
                    'gender' => $user->gender,
                    'role_id' => $role ? $role->role_id : null,
                    'role_name' => $role ? $role->role_name : null,
                    'created_at' => $user->created_at,
                ];
            });

            ActivityLog::create([
                'user_id' => Auth::user() ? Auth::user()->user_id : null,
                'action_type' => 'عرض قائمة الحسابات',
                'description' => 'عرض كل حسابات المستخدمين',
                'model_type' => 'User',
                'model_id' => null,
                'ip_address' => request()->ip(),
                'user_agent' => request()->header('User-Agent'),
            ]);

            return response()->json($employees);
        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ أثناء جلب قائمة الموظفين: '.$e->getMessage()], 500);
        }
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
                // 'role_id' => 'required|exists:roles,role_id',
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
            $employee->roles()->attach(2); // في حالة ان اي مستخدم يتم انشاءه هنا هو موظف
            // $employee->roles()->attach($request->role_id); //  في حالة ان المنشأ يحدد دور المستخدم الذي يتم انشاءه هنا

            ActivityLog::create([
                'user_id' => Auth::user() ? Auth::user()->user_id : null,
                'action_type' => 'إنشاء حساب',
                'description' => 'إنشاء حساب مستخدم جديد باسم '.$employee->user_name,
                'model_type' => 'User',
                'model_id' => $employee->user_id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->header('User-Agent'),
            ]);

            return response()->json(['message' => 'تم إضافة الموظف بنجاح', 'employee' => $employee]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ أثناء إضافة الموظف: '.$e->getMessage()], 500);
        }
    }

    //  عرض موظف محدد بالتفصيل
    public function show($user_id)
    {
        try {
            $employee = User::with('roles')->findOrFail($user_id);
            $role = $employee->roles->first(); // أخذ أول دور فقط

            $data = [
                'user_id' => $employee->user_id,
                'user_name' => $employee->user_name,
                'national_num' => $employee->national_num,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'phone_num' => $employee->phone_num,
                'email' => $employee->email,
                'age' => $employee->age,
                'gender' => $employee->gender,
                'role_id' => $role ? $role->role_id : null,
                'role_name' => $role ? $role->role_name : null,
                'created_at' => $employee->created_at,
            ];
            ActivityLog::create([
                'user_id' => Auth::user() ? Auth::user()->user_id : null,
                'action_type' => 'البحث عن حساب',
                'description' => 'البحث عن حساب المستخدم '.$employee->user_name,
                'model_type' => 'User',
                'model_id' => $employee->user_id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->header('User-Agent'),
            ]);

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ أثناء جلب بيانات الموظف: '.$e->getMessage()], 500);
        }
    }

    //  تعديل بيانات موظف
    public function update(Request $request, $user_id)
    {
        try {
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

            if ($request->password) {
                $employee->password = Hash::make($request->password);
                $employee->save();
            }

            // if ($request->role_id) {
            //     // تحديث الدور الحالي للموظف واستبداله بالدور الجديد
            //     $employee->roles()->sync([$request->role_id]);
            // }

            ActivityLog::create([
                'user_id' => Auth::user() ? Auth::user()->user_id : null,
                'action_type' => 'تعديل بيانات حساب',
                'description' => 'تم تعديل حساب المستخدم '.$employee->user_name,
                'model_type' => 'User',
                'model_id' => $employee->user_id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->header('User-Agent'),
            ]);

            return response()->json(['message' => 'تم تعديل بيانات الموظف بنجاح', 'employee' => $employee]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ أثناء تعديل بيانات الموظف: '.$e->getMessage()], 500);
        }
    }

    //  حذف موظف
    public function destroy($user_id)
    {
        try {
            $employee = User::findOrFail($user_id);
            $name = $employee->user_name;
            $employee->roles()->detach();
            $employee->delete();

            ActivityLog::create([
                'user_id' => Auth::user() ? Auth::user()->user_id : null,
                'action_type' => 'حذف حساب',
                'description' => 'تم حذف حساب المستخدم ذو المعرف: '.$name,
                'model_type' => 'User',
                'model_id' => $user_id,
                'ip_address' => request()->ip(),
                'user_agent' => request()->header('User-Agent'),
            ]);

            return response()->json(['message' => 'تم حذف الموظف بنجاح']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ أثناء حذف الموظف: '.$e->getMessage()], 500);
        }
    }
}

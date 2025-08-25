"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StandardApi } from "@/app/api/StandarApi";
import useAccidentStore from "@/stores/useAccidentStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return () => {
      useAccidentStore.getState().cleanupSSE();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // استخدام تابع post الموجود في StandardApi بدلاً من الاتصال المباشر
      const {
        success,
        data,
        error: apiError,
      } = await StandardApi.post("/login", {
        email,
        password,
      });

      if (!success) {
        throw new Error(apiError || "Login failed, please try again");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          role: data.role,
          name: data.name || email,
          // إضافة أي بيانات أخرى تحتاجها
        })
      );

      // تفعيل اتصال SSE بعد تسجيل الدخول بنجاح
      try {
        await useAccidentStore.getState().setupSSEConnection();
      } catch (sseError) {
        console.error("SSE connection error:", sseError);
        // لا نوقف عملية تسجيل الدخول إذا فشل اتصال SSE
      }

      router.push(
        data.role === "Manager" ? "/adminDashboard" : "/employeeDashboard"
      );
    } catch (err) {
      setError(err.message);
      // تنظيف أي اتصالات SSE في حالة الخطأ
      useAccidentStore.getState().cleanupSSE();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-8 bg-customDarkGreenbg rounded-lg shadow-lg">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h5 className="text-2xl text-center font-bold text-milkColor">
          تسجيل الدخول
        </h5>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            البريد الالكتروني
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b7a579] focus:border-[#b7a579]"
            placeholder="name@company.com"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            كلمة السر
          </label>

          {/* حاوية relative لوضع زر العين داخل الحقل */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 pr-10 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b7a579] focus:border-[#b7a579]"
              required
              disabled={isLoading}
            />

            {/* زر العين */}
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-600"
              aria-label={showPassword ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
              tabIndex={0}
              disabled={isLoading}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0112 19c-4.477 0-8.268-2.943-9.542-7a11.03 11.03 0 012.06-3.354" />
                  <path d="M1 1l22 22" />
                  <path d="M9.88 9.88A3 3 0 0012 15a3 3 0 003-3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-5 py-3 text-sm font-medium text-white bg-customDarkGreen rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#b7a579] focus:ring-opacity-50 disabled:opacity-50 flex items-center justify-center transition-colors duration-300"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              جاري المعالجة...
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </button>
      </form>
    </div>
  );
}

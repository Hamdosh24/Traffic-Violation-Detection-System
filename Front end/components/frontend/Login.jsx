"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StandardApi } from "@/app/api/StandarApi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const {
        success,
        data,
        error: apiError,
      } = await StandardApi.post("/login", { email, password });
      if (!success) {
        throw new Error(apiError || "Login failed, please try again");
      }

      localStorage.setItem("token", data.access_token);
      console.log("token", data.access_token);
      localStorage.setItem("user", JSON.stringify({ role: data.role }));
      console.log("user", JSON.stringify({ role: data.role }));

      router.push(
        data.role === "Manager" ? "/adminDashboard" : "/employeeDashboard"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-8 bg-customDarkGreenbg rounded-lg shadow-lg">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h5 className="text-2xl text-center font-bold text-milkColor">
          Sign in to your account
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
            Email address
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
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b7a579] focus:border-[#b7a579]"
            required
            disabled={isLoading}
          />
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
            "Login to your account"
          )}
        </button>
      </form>
    </div>
  );
}

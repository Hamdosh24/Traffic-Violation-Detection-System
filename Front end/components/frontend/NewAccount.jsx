"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Data from "../../Account.json";

export default function NewAccountForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Father: "",
    Mother: "",
    ID: "",
    Email: "",
    Position: "",
    Status: "active",
    Password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // التحقق من عدم تكرار الـ ID
      const idExists = Data.some((emp) => emp.ID === formData.ID);
      if (idExists) {
        toast.error("Employee ID already exists");
        return;
      }

      // التحقق من عدم تكرار البريد الإلكتروني
      const emailExists = Data.some((emp) => emp.Email === formData.Email);
      if (emailExists) {
        toast.error("Email already exists");
        return;
      }

      // إنشاء الحساب الجديد
      const newAccount = { ...formData };

      // في تطبيق حقيقي، هنا ستضيف استدعاء API
      Data.push(newAccount);

      toast.success("Account created successfully!");
      router.push("/adminDashboard/accounts");
    } catch (error) {
      toast.error("Failed to create account: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            placeholder="Enter full name"
          />
        </div>

        {/* Father Field */}
        <div>
          <label
            htmlFor="father"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Father's Name *
          </label>
          <input
            type="text"
            id="father"
            name="Father"
            value={formData.Father}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            placeholder="Enter father's name"
          />
        </div>

        {/* Mother Field */}
        <div>
          <label
            htmlFor="mother"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Mother's Name *
          </label>
          <input
            type="text"
            id="mother"
            name="Mother"
            value={formData.Mother}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            placeholder="Enter mother's name"
          />
        </div>

        {/* Position Field */}
        <div>
          <label
            htmlFor="position"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Position *
          </label>
          <input
            type="text"
            id="position"
            name="Position"
            value={formData.Position}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            placeholder="Enter job position"
          />
        </div>

        {/* ID Field - Manual Input */}
        <div>
          <label
            htmlFor="id"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Employee ID *
          </label>
          <input
            type="text"
            id="id"
            name="ID"
            value={formData.ID}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            placeholder="Enter unique employee ID"
          />
          {Data.some((emp) => emp.ID === formData.ID) && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              This ID is already in use
            </p>
          )}
        </div>

        {/* Status Field */}
        <div>
          <label
            htmlFor="status"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Status *
          </label>
          <select
            id="status"
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          >
            <option value="active">online</option>
            <option value="inactive">offline</option>
          </select>
        </div>
      </div>

      {/* Email Field */}
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          placeholder="Enter email address"
        />
        {Data.some((emp) => emp.Email === formData.Email) && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
            This email is already registered
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Password *
        </label>
        <input
          type="password"
          id="password"
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
          minLength="6"
          placeholder="Enter password (min 6 characters)"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push("/adminDashboard/accounts")}
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
      </div>
    </form>
  );
}

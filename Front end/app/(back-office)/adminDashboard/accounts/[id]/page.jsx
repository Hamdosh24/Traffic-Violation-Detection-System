"use client";
import Link from "next/link";
import Data from "../../../../../Account.json";

export default function AccountDetail({ params }) {
  const { id } = params; // تغيير من ID إلى id لتتوافق مع Next.js الديناميكي

  const employee = Data.find((emp) => emp.ID === id);

  if (!employee) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Employee Not Found</h1>
        <Link
          href="/adminDashboard/accounts"
          className="text-blue-600 hover:underline"
        >
          ← Back to all accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Employee Details: {employee.Name}
        </h1>
        <div className="space-x-2">
          <Link
            href={`/adminDashboard/accounts/${id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this employee?")) {
                // TODO: Implement delete functionality
                // يمكنك استخدام router.push بعد الحذف
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Personal Information
          </h2>
          <div className="space-y-4">
            <DetailItem label="Full Name" value={employee.Name} />
            <DetailItem label="Father's Name" value={employee.Father} />
            <DetailItem label="Mother's Name" value={employee.Mother} />
            <DetailItem label="Employee ID" value={employee.ID} />
          </div>
        </div>

        {/* Work Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Work Information
          </h2>
          <div className="space-y-4">
            <DetailItem label="Position" value={employee.Position} />
            <DetailItem label="Email" value={employee.Email} />
            <DetailItem
              label="Status"
              value={
                <span
                  className={`status-badge ${employee.Status.toLowerCase()}`}
                >
                  {employee.Status}
                </span>
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/adminDashboard/accounts"
          className="text-customGreen hover:underline flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to all accounts
        </Link>
      </div>
    </div>
  );
}

// Component for consistent detail items
function DetailItem({ label, value }) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-gray-900 dark:text-white">{value || "N/A"}</p>
    </div>
  );
}

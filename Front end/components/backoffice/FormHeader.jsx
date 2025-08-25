import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function FormHeader({ title }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between py-6 px-12 dark:bg-slate-600 dark:text-slate-50 bg-white text-slate-800 rounded-lg shadow-md mb-12">
      <h2 className="text-xl font-semibold">{title}</h2>
      <button onClick={() => router.back()} className="">
        <X />
      </button>
    </div>
  );
}

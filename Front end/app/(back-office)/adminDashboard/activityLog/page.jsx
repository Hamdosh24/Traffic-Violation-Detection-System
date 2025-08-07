"use client";
import Heading from "@/components/backoffice/Heading";
import ActivityTable from "@/components/backoffice/ActivityTable";

export default function page() {
  return (
    <div>
      <div
        className="flex justify-between border-b border-slate-500 py-4 mb-4 "
        dir="rtl"
      >
        <Heading title="سجل النشاط" />
      </div>
      <ActivityTable />
    </div>
  );
}

"use client";
import PageHeader from "@/components/backoffice/PageHeader";
import CrudTable from "@/components/backoffice/CrudTable";

export default function page() {
  return (
    <div>
      {/* Header */}
      <PageHeader
        heading="الحسابات"
        href="/adminDashboard/accounts/new"
        LinkTitle="اضافة حساب"
      />
      {/* Table Actions */}

      <CrudTable idEmployee />
    </div>
  );
}

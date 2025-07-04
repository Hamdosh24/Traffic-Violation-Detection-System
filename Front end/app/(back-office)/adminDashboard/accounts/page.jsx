"use client";
import PageHeader from "@/components/backoffice/PageHeader";
import CrudTable from "@/components/backoffice/CrudTable";

export default function page() {
  return (
    <div>
      {/* Header */}
      <PageHeader
        heading="Accounts"
        href="/adminDashboard/accounts/new"
        LinkTitle="Add Account"
      />
      {/* Table Actions */}

      <CrudTable idEmployee />
    </div>
  );
}

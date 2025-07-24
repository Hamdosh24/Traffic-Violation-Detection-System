"use client";
import React from "react";
import Heading from "@/components/backoffice/Heading";
import NewAccount from "@/components/frontend/NewAccount";

export default function page() {
  return (
    <div className="p-4">
      <Heading title="انشاء حساب جديد" />
      <NewAccount isEditMode={false} />
    </div>
  );
}

"use client";
import React from "react";
import Heading from "@/components/backoffice/Heading";
import NewAccount from "@/components/FormInputs/NewAccount";

export default function page() {
  return (
    <div className="p-4">
      <Heading title="انشاء حساب جديد للموظف" />
      <NewAccount isEditMode={false} />
    </div>
  );
}

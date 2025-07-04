"use client";
import React from "react";
import Heading from "@/components/backoffice/Heading";
import NewAccount from "@/components/frontend/NewAccount";

export default function page() {
  return (
    <div className="p-4">
      <Heading title="Create New Account" />
      <NewAccount />
    </div>
  );
}

"use client";
import Heading from "@/components/backoffice/Heading";
import SearchPlate from "@/components/backoffice/SearchPlate";
import React from "react";

export default function page() {
  return (
    <div>
      <Heading title="تعقب سيارة من خلال رقم اللوحة" />
      <SearchPlate />
    </div>
  );
}

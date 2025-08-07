import Heading from "@/components/backoffice/Heading";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PageHeader({ heading, LinkTitle, href }) {
  return (
    <div className="flex justify-between border-b border-slate-500 py-4 mb-4 ">
      <Heading title={heading} />
      <Link
        className="text-white bg-customGreen hover:bg-customGreen/70 focus:ring-4 focus:outline-none focus:ring-customGreen/50 font-medium rounded-lg text-base px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-customGreen/55 me-2 mb-2"
        href={href}
      >
        <Plus />
        <span>{LinkTitle}</span>
      </Link>
    </div>
  );
}

import React from "react";

export default function Heading({ title }) {
  return (
    <h2 className="flex items-center justify-end text-3xl font-semibold pt-2 text-slate-800 dark:text-slate-50">
      {title}
    </h2>
  );
}

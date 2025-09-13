import Heading from "@/components/backoffice/Heading";
import ViolationTable from "@/components/backoffice/ViolationTable";

export default function page() {
  return (
    <div>
      <div
        className="flex justify-between border-b border-slate-500 py-4 mb-4 "
        dir="rtl"
      >
        <Heading title="سجل المخالفات" />
      </div>
      <ViolationTable />
    </div>
  );
}

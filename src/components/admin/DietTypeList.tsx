"use client";

import { toast } from "sonner";
import { deleteDietType } from "@/lib/actions/diet-types";

type DietType = { id: string; nameEn: string; nameAm: string };

export default function DietTypeList({ dietTypes }: { dietTypes: DietType[] }) {
  async function handleDelete(id: string) {
    const confirmed = confirm("Delete this option?");
    if (!confirmed) return;
    const result = await deleteDietType(id);
    if (result?.success) {
      toast.success("Option deleted successfully.");
    } else {
      toast.error("Could not delete option.");
    }
  }

  return (
    <div className="space-y-2 max-w-lg">
      {dietTypes.map((d) => (
        <div key={d.id} className="flex justify-between items-center border border-neutral-800 rounded-md p-3">
          <span>{d.nameEn} <span className="text-neutral-500">/ {d.nameAm}</span></span>
          <button onClick={() => handleDelete(d.id)} className="text-red-400 text-sm hover:text-red-300">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
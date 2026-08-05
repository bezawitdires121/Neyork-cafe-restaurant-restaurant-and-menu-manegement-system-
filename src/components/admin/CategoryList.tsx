"use client";

import { toast } from "sonner";
import { deleteCategory } from "@/lib/actions/categories";

type Category = { id: string; nameEn: string; nameAm: string };

export default function CategoryList({ categories }: { categories: Category[] }) {
  async function handleDelete(id: string) {
    const confirmed = confirm("Delete this category?");
    if (!confirmed) return;
    const result = await deleteCategory(id);
    if (result?.success) {
      toast.success("Category deleted successfully.");
    } else {
      toast.error("Could not delete category.");
    }
  }

  return (
    <div className="space-y-2 max-w-lg">
      {categories.map((cat) => (
        <div key={cat.id} className="flex justify-between items-center border border-neutral-800 rounded-md p-3">
          <span>
            {cat.nameEn} <span className="text-neutral-500">/ {cat.nameAm}</span>
          </span>
          <button onClick={() => handleDelete(cat.id)} className="text-red-400 text-sm hover:text-red-300">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCategory } from "@/lib/actions/categories";

export default function CategoryForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createCategory(formData);
      if (result?.success) {
        toast.success("Category added successfully.");
        formRef.current?.reset();
        router.refresh();
      } else {
        toast.error(result?.error || "Could not add category.");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2 mb-8 max-w-lg">
      <input
        name="nameEn"
        placeholder="English name"
        className="flex-1 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white"
        required
      />
      <input
        name="nameAm"
        placeholder="Amharic name"
        className="flex-1 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white"
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-white text-black rounded-md font-medium whitespace-nowrap disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add Category"}
      </button>
    </form>
  );
}
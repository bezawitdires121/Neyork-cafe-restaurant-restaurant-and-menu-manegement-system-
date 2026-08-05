"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDietType } from "@/lib/actions/diet-types";

export default function DietTypeForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createDietType(formData);
      if (result?.success) {
        toast.success("Option added successfully.");
        formRef.current?.reset();
        router.refresh();
      } else {
        toast.error(result?.error || "Could not add option.");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2 mb-8 max-w-lg">
      <input name="nameEn" placeholder="English name" className="input flex-1" required />
      <input name="nameAm" placeholder="Amharic name" className="input flex-1" required />
      <button type="submit" disabled={isPending} className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium whitespace-nowrap disabled:opacity-50">
        {isPending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
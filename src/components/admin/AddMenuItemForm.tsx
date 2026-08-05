"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createMenuItem } from "@/lib/actions/menu-items";
import CategoryPicker from "@/components/admin/CategoryPicker";
import FileUpload from "@/components/admin/FileUpload";

export default function AddMenuItemForm({
  categories,
  dietTypes,
}: {
  categories: any[];
  dietTypes: any[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await createMenuItem(formData);

        if (result?.success) {
          toast.success("Menu item added successfully.");

          formRef.current?.reset();

          router.refresh();
        } else {
          let message = "Please check your inputs and try again.";

          if (
            result &&
            "error" in result &&
            typeof result.error === "string"
          ) {
            message = result.error;
          }

          toast.error(message);
        }
      } catch {
        toast.error(
          "Something went wrong. Please try again soon."
        );
      }
    });
  }

  return (
    <form
  ref={formRef}
  onSubmit={(e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    handleSubmit(formData);
  }}

      className="grid grid-cols-2 gap-3 mb-10 max-w-2xl border border-neutral-800 rounded-lg p-5"
    >
      <input
        name="nameEn"
        placeholder="Name (English)"
        className="input"
        required
      />

      <input
        name="nameAm"
        placeholder="Name (Amharic)"
        className="input"
        required
      />

      <textarea
        name="descEn"
        placeholder="Description (English)"
        className="input col-span-2"
        rows={2}
      />

      <textarea
        name="descAm"
        placeholder="Description (Amharic)"
        className="input col-span-2"
        rows={2}
      />

      <input
        name="ingredients"
        placeholder="Ingredients (English)"
        className="input col-span-2"
      />

      <input
        name="ingredientsAm"
        placeholder="ግብዓቶች (አማርኛ)"
        className="input col-span-2"
      />

      <input
        name="priceETB"
        type="number"
        step="0.01"
        placeholder="Price (ETB)"
        className="input"
        required
      />

      <input
        name="priceUSD"
        type="number"
        step="0.01"
        placeholder="Price (USD)"
        className="input"
        required
      />

      <select
        name="dietTypeId"
        defaultValue=""
        className="input col-span-2"
      >
        <option value="">
          No fasting classification
        </option>

        {dietTypes.map((d) => (
          <option key={d.id} value={d.id}>
            {d.nameEn}
          </option>
        ))}
      </select>

      <div className="col-span-2">
        <CategoryPicker categories={categories} />
      </div>

      <input
        name="tiktokLink"
        placeholder="TikTok link (optional)"
        className="input"
      />

      <input
        name="instagramLink"
        placeholder="Instagram link (optional)"
        className="input"
      />

      <div className="col-span-2">
        <label className="block text-xs text-neutral-400 mb-1">
          Image
        </label>

        <FileUpload name="image" />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="col-span-2 py-2 bg-white text-black rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending
          ? "Adding Menu Item..."
          : "Add Menu Item"}
      </button>
    </form>
  );
}
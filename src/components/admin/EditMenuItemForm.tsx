"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateMenuItem } from "@/lib/actions/menu-items";
import CategoryPicker from "./CategoryPicker";

export default function EditMenuItemForm({
  item,
  categories,
  dietTypes,
}: any) {
  const router = useRouter();

  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        formData.append("id", item.id);

        const result = await updateMenuItem(formData);

        if (result?.success) {
          toast.success(
            "Menu item updated successfully"
          );

          router.refresh();
        } else {
          let message =
            "Please check your inputs and try again.";

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
onSubmit={(e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  handleSubmit(formData);
}}

      className="grid grid-cols-2 gap-3 max-w-2xl border border-neutral-800 rounded-lg p-5"
    >
      <input
        name="nameEn"
        defaultValue={item.nameEn}
        className="input"
      />

      <input
        name="nameAm"
        defaultValue={item.nameAm}
        className="input"
      />

      <textarea
        name="descEn"
        defaultValue={item.descEn ?? ""}
        className="input col-span-2"
      />

      <textarea
        name="descAm"
        defaultValue={item.descAm ?? ""}
        className="input col-span-2"
      />

      <input
        name="ingredients"
        defaultValue={item.ingredients ?? ""}
        className="input col-span-2"
      />

      <input
        name="ingredientsAm"
        defaultValue={item.ingredientsAm ?? ""}
        className="input col-span-2"
      />

      <input
        name="priceETB"
        type="number"
        step="0.01"
        defaultValue={item.priceETB}
        className="input"
      />

      <input
        name="priceUSD"
        type="number"
        step="0.01"
        defaultValue={item.priceUSD}
        className="input"
      />

      <select
        name="dietTypeId"
        defaultValue={item.dietTypeId ?? ""}
        className="input col-span-2"
      >
        <option value="">
          No fasting classification
        </option>

        {dietTypes.map((d: any) => (
          <option key={d.id} value={d.id}>
            {d.nameEn}
          </option>
        ))}
      </select>

      <div className="col-span-2">
        <CategoryPicker
          categories={categories}
          initialSelected={[item.categoryId]}
        />
      </div>

      <button
        disabled={pending}
        className="col-span-2 bg-white text-black py-2 rounded-md disabled:opacity-50"
      >
        {pending
          ? "Updating..."
          : "Update Menu Item"}
      </button>
    </form>
  );
}
"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadGalleryImage } from "@/lib/actions/gallery";
import FileUpload from "@/components/admin/FileUpload";

export default function GalleryUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await uploadGalleryImage(formData);
        if (result?.success) {
          toast.success("Image uploaded successfully.");
          formRef.current?.reset();
          router.refresh();
        } else {
          toast.error(result?.error || "Something went wrong. Please try again.");
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
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
  className="flex gap-3 mb-8 max-w-2xl items-end flex-wrap"
>
      <div className="w-full">
        <label className="block text-xs text-neutral-400 mb-1">Image</label>
        <FileUpload name="image" required />
      </div>
      <input name="caption" placeholder="Caption (optional)" className="input" />
      <select name="category" className="input">
        <option value="">Category</option>
        <option value="food">Food</option>
        <option value="drinks">Drinks</option>
        <option value="desserts">Desserts</option>
        <option value="interior">Interior</option>
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium disabled:opacity-50"
      >
        {isPending ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
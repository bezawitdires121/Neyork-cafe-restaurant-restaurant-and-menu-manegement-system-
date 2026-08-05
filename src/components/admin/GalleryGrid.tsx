"use client";

import Image from "next/image";
import { toast } from "sonner";
import { toggleGalleryFeatured, deleteGalleryImage } from "@/lib/actions/gallery";

type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  isFeatured: boolean;
};

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  async function handleFeatured(id: string, value: boolean) {
    const result = await toggleGalleryFeatured(id, value);
    if (result?.success) {
      toast.success(value ? "Marked as featured." : "Removed from featured.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  async function handleDelete(id: string) {
    const confirmed = confirm("Delete this image?");
    if (!confirmed) return;
    const result = await deleteGalleryImage(id);
    if (result?.success) {
      toast.success("Image deleted successfully.");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((img) => (
        <div key={img.id} className="border border-neutral-800 rounded-lg overflow-hidden">
          <div className="relative w-full h-32">
            <Image src={img.imageUrl} alt={img.caption ?? ""} fill className="object-cover" />
          </div>
          <div className="p-2">
            {img.caption && <p className="text-xs text-neutral-400">{img.caption}</p>}
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => handleFeatured(img.id, !img.isFeatured)}
                className="text-xs text-yellow-500"
              >
                {img.isFeatured ? "★ Featured" : "☆ Feature"}
              </button>
              <button onClick={() => handleDelete(img.id)} className="text-xs text-red-400">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      {images.length === 0 && <p className="text-neutral-500 mt-4">No images yet.</p>}
    </div>
  );
}
import { prisma } from "@/lib/prisma";
import GalleryUploadForm from "@/components/admin/GalleryUploadForm";
import GalleryGrid from "@/components/admin/GalleryGrid";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Gallery</h1>
      <GalleryUploadForm />
      <GalleryGrid images={images} />
    </div>
  );
}
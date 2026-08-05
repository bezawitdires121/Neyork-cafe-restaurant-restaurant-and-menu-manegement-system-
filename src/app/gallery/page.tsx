import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import FloatingActionBar from "@/components/FloatingActionBar";
import Footer from "@/components/Footer";
import GalleryPageContent from "@/components/GalleryPageContent";

export default async function GalleryPage() {
  const [images, restaurant] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { order: "asc" } }),
    prisma.restaurant.findFirst(),
  ]);

  return (
    <>
      <Navbar />
      <FloatingActionBar />
      <GalleryPageContent images={images} />
      <Footer restaurant={restaurant} />
    </>
  );
}
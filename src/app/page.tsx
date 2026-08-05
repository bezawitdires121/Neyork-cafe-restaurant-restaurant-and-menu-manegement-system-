import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import FloatingActionBar from "@/components/FloatingActionBar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import MostLovedDishes from "@/components/MostLovedDishes";
import OurStoryPreview from "@/components/OurStoryPreview";
import GalleryPreview from "@/components/GalleryPreview";
import LovedByLocals from "@/components/LovedByLocals";
import VisitUs from "@/components/VisitUs";
import LanguageGate from "@/components/LanguageGate";
import ScrollReveal from "@/components/ScrollReveal";

export default async function Home() {
  const [restaurant, dishes, galleryImages, reviews] = await Promise.all([
    prisma.restaurant.findFirst(),
    prisma.menuItem.findMany({
      where: { isFeatured: true, isAvailable: true },
      take: 6,
      orderBy: { rating: "desc" },
    }),
    prisma.galleryImage.findMany({
      where: { isFeatured: true },
      take: 6,
      orderBy: { order: "asc" },
    }),
    prisma.review.findMany({
      where: { isApproved: true, isFeatured: true },
      include: { menuItem: true },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const social = (restaurant?.socialLinks as Record<string, string>) || {};
  const hours = (restaurant?.openingHours as Record<string, string>) || {};

  return (
    <LanguageGate>
      <Navbar />
      <FloatingActionBar />

      <ScrollReveal>
        <HeroSection
          name={restaurant?.name ?? "New York Cafe & Restaurant"}
          nameAm={restaurant?.nameAm ?? ""}
          socialLinks={social}
        />
      </ScrollReveal>

      <ScrollReveal>
        <MostLovedDishes dishes={dishes} />
      </ScrollReveal>

      <ScrollReveal>
        <OurStoryPreview story={restaurant?.storyContent} />
      </ScrollReveal>

      <ScrollReveal>
        <GalleryPreview images={galleryImages} />
      </ScrollReveal>

      <ScrollReveal>
        <LovedByLocals reviews={reviews} />
      </ScrollReveal>

      <ScrollReveal>
        <VisitUs
          hours={hours}
          address={restaurant?.address}
          phone={restaurant?.phone}
          lat={restaurant?.latitude}
          lng={restaurant?.longitude}
        />
      </ScrollReveal>

      <Footer restaurant={restaurant} />
    </LanguageGate>
  );
}
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import FloatingActionBar from "@/components/FloatingActionBar";
import Footer from "@/components/Footer";
import AboutContent from "@/components/AboutContent";

export default async function AboutPage() {
  const restaurant = await prisma.restaurant.findFirst();

  return (
    <>
      <Navbar />
      <FloatingActionBar />
      <AboutContent story={restaurant?.storyContent} />
      <Footer restaurant={restaurant} />
    </>
  );
}
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import FloatingActionBar from "@/components/FloatingActionBar";
import Footer from "@/components/Footer";
import ContactPageContent from "@/components/ContactPageContent";

export default async function ContactPage() {
  const restaurant = await prisma.restaurant.findFirst();
  const social = (restaurant?.socialLinks as Record<string, string>) || {};
  const hours = (restaurant?.openingHours as Record<string, string>) || {};

  return (
    <>
      <Navbar />
      <FloatingActionBar />
      <ContactPageContent restaurant={restaurant} social={social} hours={hours} />
      <Footer restaurant={restaurant} />
    </>
  );
}
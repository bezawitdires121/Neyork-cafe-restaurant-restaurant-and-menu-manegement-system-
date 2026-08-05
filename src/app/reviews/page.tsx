import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import FloatingActionBar from "@/components/FloatingActionBar";
import Footer from "@/components/Footer";
import ReviewsPageContent from "@/components/ReviewsPageContent";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const { item } = await searchParams;

  const [reviews, menuItems, selectedItem, restaurant] = await Promise.all([
    prisma.review.findMany({
      where: { isApproved: true, ...(item ? { menuItemId: item } : {}) },
      include: { menuItem: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.menuItem.findMany({ where: { isAvailable: true }, select: { id: true, nameEn: true, nameAm: true } }),
    item
      ? prisma.menuItem.findUnique({ where: { id: item }, select: { nameEn: true, nameAm: true, rating: true, ratingCount: true } })
      : null,
    prisma.restaurant.findFirst(),
  ]);

  return (
    <>
      <Navbar />
      <FloatingActionBar />
      <ReviewsPageContent
        reviews={reviews}
        menuItems={menuItems}
        preselectedItemId={item}
        selectedItem={selectedItem}
      />
      <Footer restaurant={restaurant} />
    </>
  );
}
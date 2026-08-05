import { prisma } from "@/lib/prisma";
import MenuBrowser from "@/components/MenuBrowser";
import ScrollReveal from "@/components/ScrollReveal";

export default async function MenuPage() {
  const [items, categories, restaurant, dietTypes] = await Promise.all([
    prisma.menuItem.findMany({
      where: { isAvailable: true },
      include: { category: true, additionalCategories: true },
      orderBy: { nameEn: "asc" },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.restaurant.findFirst(),
    prisma.dietType.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <ScrollReveal>
      <MenuBrowser
        items={items}
        categories={categories}
        exchangeRate={restaurant?.exchangeRate ?? 1}
        dietTypes={dietTypes}
      />
    </ScrollReveal>
  );
}
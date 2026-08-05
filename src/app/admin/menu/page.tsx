import { prisma } from "@/lib/prisma";
import AddMenuItemForm from "@/components/admin/AddMenuItemForm";
import MenuItemsGrid from "@/components/admin/MenuItemsGrid";

export default async function MenuPage() {
  const [items, categories, dietTypes] = await Promise.all([
    prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.dietType.findMany({
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Menu Items
      </h1>

      {categories.length === 0 ? (
        <p className="text-yellow-400 mb-6">
          Add at least one category before creating menu items.
        </p>
      ) : (
        <AddMenuItemForm
          categories={categories}
          dietTypes={dietTypes}
        />
      )}

      <MenuItemsGrid items={items} />
    </div>
  );
}
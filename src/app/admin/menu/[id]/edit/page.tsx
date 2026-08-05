import { prisma } from "@/lib/prisma";
import EditMenuItemForm from "@/components/admin/EditMenuItemForm";
import { notFound } from "next/navigation";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const [item, categories, dietTypes] = await Promise.all([
    prisma.menuItem.findUnique({
      where: {
        id,
      },
    }),

    prisma.category.findMany({
      orderBy: {
        order: "asc",
      },
    }),

    prisma.dietType.findMany({
      orderBy: {
        order: "asc",
      },
    }),
  ]);


  if (!item) {
    notFound();
  }


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Edit Menu Item
      </h1>

      <EditMenuItemForm
        item={item}
        categories={categories}
        dietTypes={dietTypes}
      />
    </div>
  );
}
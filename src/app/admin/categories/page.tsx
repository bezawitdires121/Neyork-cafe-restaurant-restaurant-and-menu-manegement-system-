import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryList from "@/components/admin/CategoryList";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>
      <CategoryForm />
      <CategoryList categories={categories} />
    </div>
  );
}
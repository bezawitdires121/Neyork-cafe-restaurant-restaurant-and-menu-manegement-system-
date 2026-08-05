import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "@/lib/actions/categories";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>

      <form
  action={async (formData) => {
    await createCategory(formData);
  }}
  className="flex gap-2 mb-8 max-w-lg"
>
        <input
          name="nameEn"
          placeholder="English name"
          className="flex-1 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white"
          required
        />

        <input
          name="nameAm"
          placeholder="Amharic name"
          className="flex-1 px-3 py-2 rounded-md bg-neutral-900 border border-neutral-700 text-white"
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-white text-black rounded-md font-medium whitespace-nowrap"
        >
          Add Category
        </button>
      </form>

      <div className="space-y-2 max-w-lg">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex justify-between items-center border border-neutral-800 rounded-md p-3"
          >
            <span>
              {cat.nameEn}{" "}
              <span className="text-neutral-500">
                / {cat.nameAm}
              </span>
            </span>

            <form action={deleteCategory.bind(null, cat.id)}>
              <button
                type="submit"
                className="text-red-400 text-sm hover:text-red-300"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
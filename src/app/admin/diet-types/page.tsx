import { prisma } from "@/lib/prisma";
import { createDietType, deleteDietType } from "@/lib/actions/diet-types";

export default async function DietTypesPage() {
  const dietTypes = await prisma.dietType.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Fasting / Non-Fasting Options
      </h1>

      <form
        action={createDietType}
        className="flex gap-2 mb-8 max-w-lg"
      >
        <input
          name="nameEn"
          placeholder="English name"
          className="input flex-1"
          required
        />

        <input
          name="nameAm"
          placeholder="Amharic name"
          className="input flex-1"
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium whitespace-nowrap"
        >
          Add
        </button>
      </form>

      <div className="space-y-2 max-w-lg">
        {dietTypes.map((d) => (
          <div
            key={d.id}
            className="flex justify-between items-center border border-neutral-800 rounded-md p-3"
          >
            <span>
              {d.nameEn}{" "}
              <span className="text-neutral-500">
                / {d.nameAm}
              </span>
            </span>

            <form action={deleteDietType.bind(null, d.id)}>
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
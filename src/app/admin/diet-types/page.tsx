import { prisma } from "@/lib/prisma";
import DietTypeForm from "@/components/admin/DietTypeForm";
import DietTypeList from "@/components/admin/DietTypeList";

export default async function DietTypesPage() {
  const dietTypes = await prisma.dietType.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Fasting / Non-Fasting Options</h1>
      <DietTypeForm />
      <DietTypeList dietTypes={dietTypes} />
    </div>
  );
}
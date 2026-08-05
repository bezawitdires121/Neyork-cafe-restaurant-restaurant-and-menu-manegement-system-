"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  nameEn: z.string().min(1),
  nameAm: z.string().min(1),
});

export async function createCategory(formData: FormData) {
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "Both names required." };

  const count = await prisma.category.count();
  await prisma.category.create({ data: { ...parsed.data, order: count } });
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
  return { success: true };
}
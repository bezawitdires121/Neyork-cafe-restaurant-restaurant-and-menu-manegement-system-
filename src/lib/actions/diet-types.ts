"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({ nameEn: z.string().min(1), nameAm: z.string().min(1) });

export async function createDietType(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "Both names required." };
  const count = await prisma.dietType.count();
  await prisma.dietType.create({ data: { ...parsed.data, order: count } });
  revalidatePath("/admin/diet-types");
  return { success: true };
}

export async function deleteDietType(id: string) {
  await prisma.dietType.delete({ where: { id } });
  revalidatePath("/admin/diet-types");
  return { success: true };
}
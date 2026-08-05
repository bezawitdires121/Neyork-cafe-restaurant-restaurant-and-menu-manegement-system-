"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const floorSchema = z.object({ name: z.string().min(1), nameAm: z.string().optional() });
const tableSchema = z.object({
  floorId: z.string().min(1),
  number: z.string().min(1),
  capacity: z.coerce.number().int().positive(),
});

export async function createFloor(formData: FormData) {
  const parsed = floorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "Invalid name." };

  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return { success: false, error: "No restaurant found." };

  const count = await prisma.floor.count({ where: { restaurantId: restaurant.id } });
  await prisma.floor.create({
    data: { name: parsed.data.name, nameAm: parsed.data.nameAm || null, order: count, restaurantId: restaurant.id },
  });
  revalidatePath("/admin/floors");
  return { success: true };
}

export async function updateFloorName(floorId: string, formData: FormData) {
  const parsed = floorSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "Invalid name." };

  await prisma.floor.update({
    where: { id: floorId },
    data: { name: parsed.data.name, nameAm: parsed.data.nameAm || null },
  });
  revalidatePath("/admin/floors");
  return { success: true };
}

export async function deleteFloor(floorId: string) {
  await prisma.floor.delete({ where: { id: floorId } });
  revalidatePath("/admin/floors");
}

export async function createTable(formData: FormData) {
  const parsed = tableSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, error: "Invalid table data." };

  await prisma.table.create({ data: parsed.data });
  revalidatePath("/admin/floors");
  return { success: true };
}

export async function toggleTableEnabled(tableId: string, isEnabled: boolean) {
  await prisma.table.update({ where: { id: tableId }, data: { isEnabled } });
  revalidatePath("/admin/floors");
}

export async function deleteTable(tableId: string) {
  await prisma.table.delete({ where: { id: tableId } });
  revalidatePath("/admin/floors");
}
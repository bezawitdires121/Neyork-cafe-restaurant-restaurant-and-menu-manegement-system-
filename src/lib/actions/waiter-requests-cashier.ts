"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function resolveWaiterRequest(id: string) {
  await prisma.waiterRequest.update({ where: { id }, data: { status: "RESOLVED" } });
  revalidatePath("/cashier");
}
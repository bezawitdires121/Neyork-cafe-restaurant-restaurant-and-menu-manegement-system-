"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { headers } from "next/headers";
import { publicActionLimiter } from "@/lib/rate-limit";

const requestSchema = z.object({
  floorId: z.string().min(1),
  tableId: z.string().min(1),
  type: z.enum(["BILL", "WATER", "BREAD_INJERA", "ASSISTANCE", "OTHER"]),
  note: z.string().optional(),
});

export async function createWaiterRequest(input: z.infer<typeof requestSchema>) {
   const headersList = await headers();

  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const { success } = await publicActionLimiter.limit(ip);

  if (!success) {
    return {
      success: false,
      error: "Too many requests. Please wait a moment and try again.",
    };
  }

  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid request." };

  await prisma.waiterRequest.create({ data: parsed.data });
  revalidatePath("/cashier");
  return { success: true };
}
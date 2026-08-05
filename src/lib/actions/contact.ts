"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { publicActionLimiter } from "@/lib/rate-limit";
const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

export async function submitContactMessage(input: z.infer<typeof contactSchema>) {
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
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Please fill in all fields correctly." };

  await prisma.contactMessage.create({ data: parsed.data });
  return { success: true };
}

export async function deleteContactMessage(id: string) {
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/contact-messages");
}
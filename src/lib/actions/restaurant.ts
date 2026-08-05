"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const restaurantSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
longitude: z.coerce.number().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  wifiPassword: z.string().optional(),
  exchangeRate: z.coerce.number().positive(),
  telebirrNumber: z.string().optional(),
  instagramLink: z.string().optional(),
  tiktokLink: z.string().optional(),
  storyContent: z.string().optional(),
});

export async function updateRestaurantSettings(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = restaurantSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) return { success: false, error: "No restaurant record found." };

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      address: parsed.data.address,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      phone: parsed.data.phone,
      email: parsed.data.email,
      wifiPassword: parsed.data.wifiPassword,
      exchangeRate: parsed.data.exchangeRate,
      telebirrNumber: parsed.data.telebirrNumber,
      storyContent: parsed.data.storyContent,
      socialLinks: {
        instagram: parsed.data.instagramLink,
        tiktok: parsed.data.tiktokLink,
      },
    },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
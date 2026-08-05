"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v4 as uuid } from "uuid";

const menuItemSchema = z.object({
  nameEn: z.string().min(1),
  nameAm: z.string().min(1),
  descEn: z.string().optional(),
  descAm: z.string().optional(),
  ingredients: z.string().optional(),
  dietTypeId: z
  .string()
  .transform((val) => val === "" ? null : val)
  .nullable()
  .optional(),
  ingredientsAm: z.string().optional(),
  priceETB: z.coerce.number().positive(),
  priceUSD: z.coerce.number().positive(),
  isAvailable: z.coerce.boolean().optional(),
  tiktokLink: z.string().optional(),
  instagramLink: z.string().optional(),
});
const updateMenuItemSchema = menuItemSchema.extend({
  id: z.string(),
});

export async function updateMenuItem(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = updateMenuItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { id, dietTypeId, ...rest } = parsed.data;

const data = {
  ...rest,
  dietTypeId: dietTypeId || null,
};
  const categoryIds = formData.getAll("categoryIds") as string[];
  if (categoryIds.length === 0) {
    return { success: false, error: "Please select at least one category." };
  }
  const [primaryCategoryId, ...restCategoryIds] = categoryIds;

  let imageUrl: string | undefined;
  const file = formData.get("image") as File;

  if (file && file.size > 0) {
    if (!file.type.startsWith("image/")) return { success: false, error: "File must be an image." };
    if (file.size > 5 * 1024 * 1024) return { success: false, error: "Image must be under 5MB." };

    const ext = file.name.split(".").pop();
    const fileName = `${uuid()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("menu-images")
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) return { success: false, error: `Upload failed: ${uploadError.message}` };

    const { data: urlData } = supabaseAdmin.storage.from("menu-images").getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  await prisma.menuItem.update({
    where: { id },
    data: {
      ...data,
      categoryId: primaryCategoryId,
      ...(imageUrl ? { imageUrl } : {}),
      additionalCategories: { set: restCategoryIds.map((cid) => ({ id: cid })) },
    },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { success: true };
}
export async function createMenuItem(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = menuItemSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const categoryIds = formData.getAll("categoryIds") as string[];
  if (categoryIds.length === 0) {
    return { success: false, error: "Please select at least one category." };
  }

  const [primaryCategoryId, ...restCategoryIds] = categoryIds;

  let imageUrl: string | undefined;
  const file = formData.get("image") as File;

  if (file && file.size > 0) {
    if (!file.type.startsWith("image/")) return { success: false, error: "File must be an image." };
    if (file.size > 5 * 1024 * 1024) return { success: false, error: "Image must be under 5MB." };

    const ext = file.name.split(".").pop();
    const fileName = `${uuid()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from("menu-images")
      .upload(fileName, buffer, { contentType: file.type });

    if (uploadError) return { success: false, error: `Upload failed: ${uploadError.message}` };

    const { data } = supabaseAdmin.storage.from("menu-images").getPublicUrl(fileName);
    imageUrl = data.publicUrl;
  }

 await prisma.menuItem.create({
  data: {
    ...parsed.data,
    dietTypeId: parsed.data.dietTypeId || null,
    categoryId: primaryCategoryId,
    imageUrl,
    additionalCategories: {
      connect: restCategoryIds.map((id) => ({ id })),
    },
  },
});

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { success: true };
}
 
export async function deleteMenuItem(id: string) {
  await prisma.menuItem.delete({
    where: { id },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");

  return { success: true };
}


export async function toggleMenuItemAvailable(id: string, available: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: {
      isAvailable: available,
    },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");

  return { success: true };
}


export async function toggleMenuItemFeatured(id: string, featured: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: {
      isFeatured: featured,
    },
  });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");

  return { success: true };
}


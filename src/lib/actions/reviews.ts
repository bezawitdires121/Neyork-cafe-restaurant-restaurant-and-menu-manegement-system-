"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { headers } from "next/headers";
import { publicActionLimiter } from "@/lib/rate-limit";

const reviewSchema = z.object({
  menuItemId: z.string().optional(),
  reviewerName: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().optional(),
  language: z.enum(["en", "am"]),
});

export async function submitReview(input: z.infer<typeof reviewSchema>) {
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
  
  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid review." };

  await prisma.review.create({
    data: {
      menuItemId: parsed.data.menuItemId || null,
      reviewerName: parsed.data.reviewerName || null,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      language: parsed.data.language,
    },
  });

  if (parsed.data.menuItemId) {
    const item = await prisma.menuItem.findUnique({ where: { id: parsed.data.menuItemId } });
    if (item) {
      const newCount = item.ratingCount + 1;
      const newAvg = (item.rating * item.ratingCount + parsed.data.rating) / newCount;
      await prisma.menuItem.update({
        where: { id: item.id },
        data: { rating: newAvg, ratingCount: newCount },
      });
    }
  }

  revalidatePath("/menu");
  revalidatePath("/reviews");
  return { success: true };
}

export async function approveReview(id: string, isApproved: boolean) {
  await prisma.review.update({ where: { id }, data: { isApproved, wasReviewed: true } });
  revalidatePath("/admin/reviews");
}

export async function deleteReview(id: string) {
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/reviews");
}

export async function toggleReviewFeatured(id: string, isFeatured: boolean) {
  await prisma.review.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/admin/reviews");
}
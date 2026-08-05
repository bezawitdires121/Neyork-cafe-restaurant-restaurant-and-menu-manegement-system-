import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [pendingReviews, messageCount] = await Promise.all([
    prisma.review.count({ where: { isApproved: false, wasReviewed: false } }),
    prisma.contactMessage.count(),
  ]);

  return NextResponse.json({ reviews: pendingReviews, messages: messageCount });
}
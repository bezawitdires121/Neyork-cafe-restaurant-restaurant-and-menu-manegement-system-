import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reviews = await prisma.review.findMany({
    where: { menuItemId: id, isApproved: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, rating: true, comment: true },
  });
  return NextResponse.json(reviews);
}
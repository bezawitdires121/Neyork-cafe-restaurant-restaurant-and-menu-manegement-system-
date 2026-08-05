import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const floors = await prisma.floor.findMany({
    include: { tables: { orderBy: { number: "asc" } } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(floors);
}
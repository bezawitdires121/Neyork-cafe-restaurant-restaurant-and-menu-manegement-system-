import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const restaurant = await prisma.restaurant.findFirst();
  return NextResponse.json({
    telebirrNumber: restaurant?.telebirrNumber ?? "",
    bankAccounts: restaurant?.bankAccounts ?? [],
    exchangeRate: restaurant?.exchangeRate ?? 1,
  });
}
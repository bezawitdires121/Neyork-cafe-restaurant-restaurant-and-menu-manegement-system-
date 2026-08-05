"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: "RECEIVED" | "PREPARING" | "SERVED" | "PAID") {
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/cashier");
}

export async function verifyPayment(orderId: string) {
  await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: "VERIFIED" } });
  revalidatePath("/cashier");
}
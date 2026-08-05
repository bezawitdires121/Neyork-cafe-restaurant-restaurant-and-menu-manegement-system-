"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { headers } from "next/headers";
import { publicActionLimiter } from "@/lib/rate-limit";

const orderSchema = z.object({
  type: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]),
  floorId: z.string().optional(),
  tableId: z.string().optional(),
  customerName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  packaging: z.string().optional(),
  paymentMethod: z.enum(["CASH", "TELEBIRR", "MOBILE_BANKING"]),
  paymentConfirmed: z.boolean().optional(),
  items: z.array(z.object({ menuItemId: z.string(), quantity: z.number().int().positive() })).min(1),
});

export async function createOrder(input: z.infer<typeof orderSchema>) {
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
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid order data." };
  }

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: parsed.data.items.map((i) => i.menuItemId) } },
  });

  if (menuItems.length !== parsed.data.items.length) {
    return { success: false, error: "Some items are no longer available." };
  }

  let totalETB = 0;
  let totalUSD = 0;
  const orderItemsData = parsed.data.items.map((oi) => {
    const menuItem = menuItems.find((m) => m.id === oi.menuItemId)!;
    totalETB += menuItem.priceETB * oi.quantity;
    totalUSD += menuItem.priceUSD * oi.quantity;
    return {
      menuItemId: menuItem.id,
      quantity: oi.quantity,
      nameEnAtOrder: menuItem.nameEn,
      nameAmAtOrder: menuItem.nameAm,
      priceETBAtOrder: menuItem.priceETB,
      priceUSDAtOrder: menuItem.priceUSD,
    };
  });

  const paymentStatus =
    parsed.data.paymentMethod === "CASH"
      ? "PENDING"
      : parsed.data.paymentConfirmed
      ? "SUBMITTED"
      : "PENDING";

  const order = await prisma.order.create({
    data: {
      type: parsed.data.type,
      floorId: parsed.data.floorId || null,
      tableId: parsed.data.tableId || null,
      customerName: parsed.data.customerName,
      phone: parsed.data.phone,
      address: parsed.data.address,
      packaging: parsed.data.packaging,
      paymentMethod: parsed.data.paymentMethod,
      paymentStatus,
      totalETB,
      totalUSD,
      items: { create: orderItemsData },
    },
  });

  return { success: true, orderId: order.id };
}
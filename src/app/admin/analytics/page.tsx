import { prisma } from "@/lib/prisma";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";

export default async function AnalyticsPage() {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 6); // last 7 days including today

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [ordersToday, ordersWeek, ordersMonth, allPaidOrders, allOrdersCount] = await Promise.all([
    prisma.order.findMany({ where: { status: "PAID", updatedAt: { gte: startOfToday } }, select: { totalETB: true } }),
    prisma.order.findMany({
      where: { status: "PAID", updatedAt: { gte: startOfWeek } },
      select: { totalETB: true, updatedAt: true },
    }),
    prisma.order.findMany({ where: { status: "PAID", updatedAt: { gte: startOfMonth } }, select: { totalETB: true } }),
    prisma.order.findMany({
      where: { status: "PAID" },
      include: { items: true },
      orderBy: { updatedAt: "desc" },
      take: 500, // cap for performance; adjust later if needed
    }),
    prisma.order.count(),
  ]);

  const revenueToday = ordersToday.reduce((sum, o) => sum + o.totalETB, 0);
  const revenueWeek = ordersWeek.reduce((sum, o) => sum + o.totalETB, 0);
  const revenueMonth = ordersMonth.reduce((sum, o) => sum + o.totalETB, 0);

  // Build a 7-day revenue series for the chart
  const dayMs = 24 * 60 * 60 * 1000;
  const dailySeries = Array.from({ length: 7 }).map((_, i) => {
    const dayStart = new Date(startOfWeek.getTime() + i * dayMs);
    const dayEnd = new Date(dayStart.getTime() + dayMs);
    const total = ordersWeek
      .filter((o) => o.updatedAt >= dayStart && o.updatedAt < dayEnd)
      .reduce((sum, o) => sum + o.totalETB, 0);
    return {
      label: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
      revenue: total,
    };
  });

  // Best-selling items (aggregate across all paid orders)
  const itemCounts: Record<string, { name: string; qty: number }> = {};
  for (const order of allPaidOrders) {
    for (const item of order.items) {
      if (!itemCounts[item.menuItemId]) itemCounts[item.menuItemId] = { name: item.nameEnAtOrder, qty: 0 };
      itemCounts[item.menuItemId].qty += item.quantity;
    }
  }
  const bestSellers = Object.values(itemCounts)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const recentOrders = allPaidOrders.slice(0, 8).map((o) => ({
    id: o.id,
    type: o.type,
    total: o.totalETB,
    date: o.updatedAt.toISOString(),
  }));

  return (
    <AnalyticsCharts
      revenueToday={revenueToday}
      revenueWeek={revenueWeek}
      revenueMonth={revenueMonth}
      ordersToday={ordersToday.length}
      totalOrders={allOrdersCount}
      dailySeries={dailySeries}
      bestSellers={bestSellers}
      recentOrders={recentOrders}
    />
  );
}
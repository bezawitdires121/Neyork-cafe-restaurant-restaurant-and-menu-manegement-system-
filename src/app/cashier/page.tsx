import { prisma } from "@/lib/prisma";
import { updateOrderStatus, verifyPayment } from "@/lib/actions/cashier-orders";
import { resolveWaiterRequest } from "@/lib/actions/waiter-requests-cashier";
import CashierSoundListener from "@/components/CashierSoundListener";
import StatusBadge from "@/components/StatusBadge";
import { Bell, UtensilsCrossed, Package, Truck } from "lucide-react";
import FloorView from "@/components/cashier/FloorView";

const statusFlow = ["RECEIVED", "PREPARING", "SERVED", "PAID"] as const;

const statusVariant: Record<string, "gold" | "warning" | "success" | "neutral"> = {
  RECEIVED: "gold",
  PREPARING: "warning",
  SERVED: "success",
  PAID: "neutral",
};

const typeIcons = { DINE_IN: UtensilsCrossed, TAKEAWAY: Package, DELIVERY: Truck };

export default async function CashierPage() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [orders, waiterRequests, paidToday, floors] = await Promise.all([
  prisma.order.findMany({
    where: { status: { not: "PAID" } },
    include: { items: true, floor: true, table: true },
    orderBy: { createdAt: "asc" },
  }),
  prisma.waiterRequest.findMany({
    where: { status: { not: "RESOLVED" } },
    include: { floor: true, table: true },
    orderBy: { createdAt: "asc" },
  }),
  prisma.order.findMany({
    where: { status: "PAID", updatedAt: { gte: startOfDay } },
    select: { totalETB: true, paymentMethod: true },
  }),
  prisma.floor.findMany({
    include: { tables: { orderBy: { number: "asc" } } },
    orderBy: { order: "asc" },
  }),
]);
const floorsWithStatus = floors.map((floor) => ({
  id: floor.id,
name: floor.name,
nameAm: floor.nameAm,
  tables: floor.tables.map((table) => {
    const activeOrder = orders.find(
      (o) => o.tableId === table.id && (o.status === "RECEIVED" || o.status === "PREPARING" || o.status === "SERVED")
    );
    return {
      id: table.id,
      number: table.number,
      capacity: table.capacity,
      isEnabled: table.isEnabled,
      orderStatus: activeOrder ? (activeOrder.status as "RECEIVED" | "PREPARING" | "SERVED") : null,
    };
  }),
}));
  const salesByMethod = { CASH: 0, TELEBIRR: 0, MOBILE_BANKING: 0 } as Record<string, number>;
  let totalSales = 0;
  for (const o of paidToday) {
    salesByMethod[o.paymentMethod ?? "CASH"] += o.totalETB;
    totalSales += o.totalETB;
  }

  return (
    <div className="min-h-screen bg-nyc-base text-nyc-cream p-6">
      <CashierSoundListener orderCount={orders.length} waiterCount={waiterRequests.length} />

      <h1 className="font-display text-2xl mb-6">Cashier Dashboard</h1>

      {/* Daily sales summary — rounded panel */}
      <div className="rounded-[var(--radius-panel)] border border-nyc-gold/10 bg-nyc-cream/[0.03] p-5 mb-8">
        <p className="text-nyc-taupe text-xs uppercase tracking-wider mb-4">Today's Sales</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl bg-nyc-gold/10 p-4">
            <p className="text-nyc-taupe text-xs mb-1">Total</p>
            <p className="text-xl font-display">{totalSales} ETB</p>
          </div>
          <div className="rounded-xl bg-nyc-cream/5 p-4">
            <p className="text-nyc-taupe text-xs mb-1">Cash</p>
            <p className="text-xl font-display">{salesByMethod.CASH} ETB</p>
          </div>
          <div className="rounded-xl bg-nyc-cream/5 p-4">
            <p className="text-nyc-taupe text-xs mb-1">Telebirr</p>
            <p className="text-xl font-display">{salesByMethod.TELEBIRR} ETB</p>
          </div>
          <div className="rounded-xl bg-nyc-cream/5 p-4">
            <p className="text-nyc-taupe text-xs mb-1">Mobile Banking</p>
            <p className="text-xl font-display">{salesByMethod.MOBILE_BANKING} ETB</p>
          </div>
        </div>
      </div>
      <FloorView floors={floorsWithStatus} />

      {/* Waiter requests */}
      {waiterRequests.length > 0 && (
        <div className="rounded-[var(--radius-panel)] border border-yellow-700/30 bg-yellow-500/[0.04] p-5 mb-8">
          <p className="flex items-center gap-2 text-sm font-medium mb-4">
            <Bell size={16} className="text-yellow-400" /> Waiter Requests
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {waiterRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-yellow-700/30 bg-nyc-base/40 p-3">
                
                <p className="font-medium text-sm">
  {req.floor.name} · Table {req.table.number}
</p>

<p className="text-nyc-taupe text-xs mt-0.5">
  {req.type.replace("_", " ")}
</p>

<p className="text-nyc-taupe/60 text-[10px] mt-1">
  {new Date(req.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
</p>
                {req.note && <p className="text-nyc-taupe/70 text-xs mt-1">{req.note}</p>}
                <form action={resolveWaiterRequest.bind(null, req.id)} className="mt-2">
                  <button type="submit" className="w-full py-1.5 bg-nyc-gold text-nyc-base rounded-full text-xs font-medium">
                    Resolve
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active orders */}
      <div className="rounded-[var(--radius-panel)] border border-nyc-gold/10 bg-nyc-cream/[0.03] p-5">
        <p className="text-nyc-taupe text-xs uppercase tracking-wider mb-4">Active Orders</p>

        {orders.length === 0 && <p className="text-nyc-taupe text-sm">No active orders.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => {
            const nextStatus = statusFlow[statusFlow.indexOf(order.status) + 1];
            const needsVerification = order.paymentMethod !== "CASH" && order.paymentStatus === "SUBMITTED";
            const TypeIcon = typeIcons[order.type];

            return (
              <div key={order.id} className="rounded-xl border border-nyc-gold/10 bg-nyc-base/40 p-4 hover:border-nyc-gold/30 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <TypeIcon size={16} className="text-nyc-gold-light" />
                    <div>
                      <p className="font-medium text-sm">
                        {order.type === "DINE_IN"
                          ? `${order.floor?.name ?? ""} · Table ${order.table?.number ?? ""}`
                          : order.type === "TAKEAWAY"
                          ? "Takeaway"
                          : "Delivery"}
                      </p>
                      {order.customerName && <p className="text-nyc-taupe text-xs">{order.customerName}</p>}
                    </div>
                  </div>
                  <div>
  <StatusBadge label={order.status} variant={statusVariant[order.status]} />

  <p className="text-nyc-taupe/60 text-[10px] mt-1">
    {new Date(order.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>
</div>
                </div>

                <div className="space-y-1 mb-3 text-sm text-nyc-taupe">
                  {order.items.map((item) => (
                    <p key={item.id}>{item.nameEnAtOrder} × {item.quantity}</p>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-3">
                  <StatusBadge
                    label={`${order.paymentMethod} · ${order.paymentStatus}`}
                    variant={order.paymentStatus === "VERIFIED" ? "success" : "neutral"}
                  />
                  <p className="font-display font-medium">{order.totalETB} ETB</p>
                </div>

                {needsVerification && (
                  <form action={verifyPayment.bind(null, order.id)} className="mb-2">
                    <button type="submit" className="w-full py-2 bg-yellow-600/80 hover:bg-yellow-600 rounded-full text-sm font-medium transition-colors">
                      Verify Payment
                    </button>
                  </form>
                )}

                {nextStatus && (
                  <form action={updateOrderStatus.bind(null, order.id, nextStatus)}>
                    <button type="submit" className="w-full py-2 bg-nyc-gold text-nyc-base rounded-full text-sm font-medium hover:brightness-110 transition-all active:scale-95">
                      Mark as {nextStatus}
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
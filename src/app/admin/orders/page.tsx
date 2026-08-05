import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, floor: true, table: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400 border-b border-neutral-800">
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4">Type</th>
              <th className="pb-2 pr-4">Location</th>
              <th className="pb-2 pr-4">Customer</th>
              <th className="pb-2 pr-4">Items</th>
              <th className="pb-2 pr-4">Total</th>
              <th className="pb-2 pr-4">Payment</th>
              <th className="pb-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-neutral-900">
                <td className="py-2 pr-4 text-neutral-400">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="py-2 pr-4">{o.type.replace("_", " ")}</td>
                <td className="py-2 pr-4">
                  {o.type === "DINE_IN" ? `${o.floor?.name ?? ""} · T${o.table?.number ?? ""}` : o.type === "DELIVERY" ? o.address : "—"}
                </td>
                <td className="py-2 pr-4">{o.customerName || "—"}</td>
                <td className="py-2 pr-4">{o.items.length}</td>
                <td className="py-2 pr-4">{o.totalETB} ETB</td>
                <td className="py-2 pr-4">{o.paymentMethod} / {o.paymentStatus}</td>
                <td className="py-2 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${o.status === "PAID" ? "bg-green-900 text-green-300" : "bg-neutral-800"}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && <p className="text-neutral-500 mt-4">No orders yet.</p>}
    </div>
  );
}
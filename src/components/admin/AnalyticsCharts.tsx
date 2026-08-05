"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { TrendingUp, ShoppingBag, Calendar, DollarSign } from "lucide-react";

type Props = {
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  ordersToday: number;
  totalOrders: number;
  dailySeries: { label: string; revenue: number }[];
  bestSellers: { name: string; qty: number }[];
  recentOrders: { id: string; type: string; total: number; date: string }[];
};

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-nyc-cream/5 border border-nyc-gold/10 p-5">
      <div className="flex items-center gap-2 text-nyc-taupe text-xs mb-2">
        <Icon size={14} /> {label}
      </div>
      <p className="font-display text-2xl text-nyc-cream">{value}</p>
    </div>
  );
}

export default function AnalyticsCharts({
  revenueToday,
  revenueWeek,
  revenueMonth,
  ordersToday,
  totalOrders,
  dailySeries,
  bestSellers,
  recentOrders,
}: Props) {
  return (
    <div>
      <h1 className="font-display text-2xl mb-6 text-nyc-cream">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Revenue Today" value={`${revenueToday} ETB`} />
        <StatCard icon={TrendingUp} label="Revenue This Week" value={`${revenueWeek} ETB`} />
        <StatCard icon={Calendar} label="Revenue This Month" value={`${revenueMonth} ETB`} />
        <StatCard icon={ShoppingBag} label="Orders Today" value={String(ordersToday)} />
      </div>

      <div className="rounded-[var(--radius-panel)] border border-nyc-gold/10 bg-nyc-cream/[0.03] p-5 mb-8">
        <p className="text-nyc-taupe text-xs uppercase tracking-wider mb-4">Revenue — Last 7 Days</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#8a7f6e20" />
              <XAxis dataKey="label" stroke="#8a7f6e" fontSize={12} />
              <YAxis stroke="#8a7f6e" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "#16130f", border: "1px solid #b8862b30", borderRadius: 8 }}
                labelStyle={{ color: "#f3ecdd" }}
              />
              <Bar dataKey="revenue" fill="#b8862b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[var(--radius-panel)] border border-nyc-gold/10 bg-nyc-cream/[0.03] p-5">
          <p className="text-nyc-taupe text-xs uppercase tracking-wider mb-4">Best Selling Items</p>
          <div className="space-y-3">
            {bestSellers.map((item, i) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-nyc-gold/10 text-nyc-gold-light text-xs flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-nyc-taupe text-xs">{item.qty} sold</span>
              </div>
            ))}
            {bestSellers.length === 0 && <p className="text-nyc-taupe text-sm">No sales data yet.</p>}
          </div>
        </div>

        <div className="rounded-[var(--radius-panel)] border border-nyc-gold/10 bg-nyc-cream/[0.03] p-5">
          <p className="text-nyc-taupe text-xs uppercase tracking-wider mb-4">Recent Orders</p>
          <div className="space-y-2">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex justify-between items-center text-sm">
                <span className="text-nyc-taupe">{o.type.replace("_", " ")}</span>
                <span>{o.total} ETB</span>
                <span className="text-nyc-taupe text-xs">{new Date(o.date).toLocaleDateString()}</span>
              </div>
            ))}
            {recentOrders.length === 0 && <p className="text-nyc-taupe text-sm">No orders yet.</p>}
          </div>
        </div>
      </div>

      <p className="text-nyc-taupe text-xs mt-4">Total orders all-time: {totalOrders}</p>
    </div>
  );
}
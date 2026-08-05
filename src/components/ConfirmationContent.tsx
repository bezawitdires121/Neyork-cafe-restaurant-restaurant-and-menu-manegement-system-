"use client";

import { useLanguage } from "@/lib/language-context";
import { useEffect, useState } from "react";
import { ClipboardCheck, ChefHat, UtensilsCrossed, CheckCircle2 } from "lucide-react";

const translations = {
  en: {
    title: "Order Received!",
    orderId: "Order ID:",
    status: "Status:",
    summary: "Order Summary",
    total: "Total:",
    thankYou: "Thank you! Your order has been received successfully.",
    wait: "Please wait while we prepare your order.",
    statusLabels: {
      RECEIVED: "Received",
      PREPARING: "Preparing",
      SERVED: "Served",
      PAID: "Paid",
    } as Record<string, string>,
  },
  am: {
    title: "ትዕዛዝዎ ተቀብሏል!",
    orderId: "የትዕዛዝ መለያ:",
    status: "ሁኔታ:",
    summary: "የትዕዛዝ ዝርዝር",
    total: "ጠቅላላ ዋጋ:",
    thankYou: "እናመሰግናለን! ትዕዛዝዎን በተሳካ ሁኔታ ተቀብለናል።",
    wait: "እባክዎ ትዕዛዝዎ እስኪዘጋጅ ድረስ ይጠብቁ።",
    statusLabels: {
      RECEIVED: "ተቀብሏል",
      PREPARING: "በማዘጋጀት ላይ",
      SERVED: "ቀርቧል",
      PAID: "ተከፍሏል",
    } as Record<string, string>,
  },
};

const statusSteps = ["RECEIVED", "PREPARING", "SERVED", "PAID"] as const;
const statusIcons = { RECEIVED: ClipboardCheck, PREPARING: ChefHat, SERVED: UtensilsCrossed, PAID: CheckCircle2 };

type OrderItem = {
  id: string;
  nameEnAtOrder: string;
  nameAmAtOrder: string;
  quantity: number;
};

type Order = {
  id: string;
  status: string;
  totalETB: number;
  items: OrderItem[];
};

export default function ConfirmationContent({ order }: { order: Order }) {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [status, setStatus] = useState(order.status);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`/api/orders/${order.id}/status`)
        .then((r) => r.json())
        .then((data) => {
          if (data.status) setStatus(data.status);
        })
        .catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [order.id]);

  const currentIndex = statusSteps.indexOf(status as (typeof statusSteps)[number]);

  return (
    <div className="min-h-screen bg-nyc-base light:bg-nyc-cream text-nyc-cream light:text-nyc-base p-4 sm:p-6 transition-colors">
      <div className="max-w-xl mx-auto rounded-[var(--radius-panel)] border border-nyc-gold/20 bg-nyc-cream/[0.04] light:bg-nyc-base/[0.03] p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-nyc-gold/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-nyc-gold" strokeWidth={1.75} />
          </div>
          <h1 className="font-display text-2xl text-nyc-cream light:text-nyc-base mb-1">{t.title}</h1>
          <p className="text-nyc-cream/50 light:text-nyc-base/50 text-xs font-mono">{t.orderId} {order.id}</p>
        </div>

        {/* Status stepper */}
        <div className="flex items-center justify-between mb-8 px-2">
          {statusSteps.map((step, idx) => {
            const Icon = statusIcons[step];
            const reached = idx <= currentIndex;
            return (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                {idx > 0 && (
                  <div
                    className={`absolute top-4 right-1/2 w-full h-[2px] -z-0 ${
                      idx <= currentIndex ? "bg-nyc-gold" : "bg-nyc-taupe/20"
                    }`}
                  />
                )}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 transition-colors ${
                    reached
                      ? "bg-nyc-gold border-nyc-gold text-nyc-base"
                      : "bg-nyc-base light:bg-nyc-cream border-nyc-taupe/30 text-nyc-taupe"
                  }`}
                >
                  <Icon size={15} strokeWidth={2} />
                </div>
                <p className={`text-[10px] text-center ${reached ? "text-nyc-cream light:text-nyc-base font-medium" : "text-nyc-taupe"}`}>
                  {t.statusLabels[step]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="rounded-xl border border-nyc-gold/15 bg-nyc-cream/[0.03] light:bg-nyc-base/[0.03] p-4 mb-6">
          <p className="text-nyc-cream/60 light:text-nyc-base/60 text-xs uppercase tracking-wider mb-3">{t.summary}</p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-nyc-cream light:text-nyc-base">
                  {lang === "en" ? item.nameEnAtOrder : item.nameAmAtOrder}
                </span>
                <span className="text-nyc-cream/60 light:text-nyc-base/60">× {item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-nyc-gold/15 mt-3 pt-3 flex justify-between items-center">
            <span className="text-nyc-cream/70 light:text-nyc-base/70 text-sm">{t.total}</span>
            <span className="font-display text-lg text-nyc-gold-light light:text-nyc-gold">{order.totalETB} ETB</span>
          </div>
        </div>

        <div className="rounded-xl bg-green-500/10 border border-green-500/25 p-4 text-center">
          <p className="text-green-400 text-sm font-medium mb-1">{t.thankYou}</p>
          <p className="text-green-400/70 text-xs">{t.wait}</p>
        </div>
      </div>
    </div>
  );
}
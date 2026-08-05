"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { X, ClipboardCheck, ChefHat, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { playCustomerChime } from "@/lib/notification-sound";

const statusSteps = ["RECEIVED", "PREPARING", "SERVED", "PAID"] as const;
const statusIcons = { RECEIVED: ClipboardCheck, PREPARING: ChefHat, SERVED: UtensilsCrossed, PAID: CheckCircle2 };

const labels = {
  en: { RECEIVED: "Received", PREPARING: "Preparing", SERVED: "Served", PAID: "Paid", track: "Order" },
  am: { RECEIVED: "ተቀብሏል", PREPARING: "በማዘጋጀት ላይ", SERVED: "ቀርቧል", PAID: "ተከፍሏል", track: "ትዕዛዝ" },
};

export default function ActiveOrderWidget() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useLanguage();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const prevStatus = useRef<string | null>(null);

  const hideOnRoutes = ["/admin", "/cashier", "/login"];
  const shouldHide = hideOnRoutes.some((r) => pathname?.startsWith(r));

  const readStoredOrder = () => {
    const stored = localStorage.getItem("nyc-active-order");
    if (stored) {
      const parsed = JSON.parse(stored);
      setOrderId(parsed.orderId);
      setDismissed(false);
    } else {
      setOrderId(null);
    }
  };

  useEffect(() => {
    readStoredOrder();
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("nyc-order-updated", readStoredOrder);
    window.addEventListener("storage", readStoredOrder);
    return () => {
      window.removeEventListener("nyc-order-updated", readStoredOrder);
      window.removeEventListener("storage", readStoredOrder);
    };
  }, []);

  useEffect(() => {
    if (!orderId) return;
    const check = () => {
      fetch(`/api/orders/${orderId}/status`)
        .then((r) => r.json())
        .then((data) => {
          if (data.status) {
            if (prevStatus.current && data.status !== prevStatus.current) {
              playCustomerChime();
            }
            prevStatus.current = data.status;
            setStatus(data.status);
            if (data.status === "PAID") {
              setTimeout(() => {
                localStorage.removeItem("nyc-active-order");
                setOrderId(null);
              }, 60000);
            }
          }
        })
        .catch(() => {});
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (shouldHide || !orderId || !status || dismissed) return null;

  const t = labels[lang];
  const Icon = statusIcons[status as (typeof statusSteps)[number]] ?? ClipboardCheck;

  return (
    <button
      onClick={() => router.push(`/order/confirmation/${orderId}`)}
      className="fixed bottom-44 right-4 z-40 flex items-center gap-3 bg-nyc-base light:bg-nyc-cream border border-nyc-gold/30 rounded-full pl-3 pr-4 py-2.5 shadow-xl hover:border-nyc-gold/60 transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-nyc-gold/15 flex items-center justify-center">
        <Icon size={15} className="text-nyc-gold" strokeWidth={2} />
      </div>
      <div className="text-left">
        <p className="text-[10px] text-nyc-cream/50 light:text-nyc-base/50">{t.track}</p>
        <p className="text-xs font-medium text-nyc-cream light:text-nyc-base">
          {t[status as keyof typeof t] ?? status}
        </p>
      </div>
      <span
        onClick={(e) => {
          e.stopPropagation();
          setDismissed(true);
        }}
        className="ml-1 w-5 h-5 flex items-center justify-center rounded-full hover:bg-nyc-cream/10 light:hover:bg-nyc-base/10 text-nyc-taupe"
      >
        <X size={12} />
      </span>
    </button>
  );
}
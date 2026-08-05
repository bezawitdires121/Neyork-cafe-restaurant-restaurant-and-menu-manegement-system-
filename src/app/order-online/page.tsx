"use client";

import { useRouter } from "next/navigation";
import { useCartStore, OrderType } from "@/lib/cart-store";
import { UtensilsCrossed, Package, Truck } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
function OrderOnlineContent() {
  const router = useRouter();
  const { lang } = useLanguage();
  const setOrderType = useCartStore((s) => s.setOrderType);

  const t = {
    title: lang === "en" ? "How would you like to order?" : "እንዴት ማዘዝ ይፈልጋሉ?",
    dineIn: lang === "en" ? "Dine In" : "በቦታው ይመገቡ",
    dineInDesc: lang === "en" ? "Eating at the restaurant" : "በምግብ ቤቱ ውስጥ",
    takeaway: lang === "en" ? "Takeaway" : "ውሰድ",
    takeawayDesc: lang === "en" ? "Pick up and go" : "ወስደው ይሂዱ",
    delivery: lang === "en" ? "Delivery" : "ማድረስ",
    deliveryDesc: lang === "en" ? "Delivered to your address" : "ወደ አድራሻዎ ይደርሳል",
  };

  const options: { type: OrderType; icon: any; label: string; desc: string }[] = [
  { type: "DINE_IN", icon: UtensilsCrossed, label: t.dineIn, desc: t.dineInDesc },
  { type: "TAKEAWAY", icon: Package, label: t.takeaway, desc: t.takeawayDesc },
  { type: "DELIVERY", icon: Truck, label: t.delivery, desc: t.deliveryDesc },
];

  const handleSelect = (type: OrderType) => {
    setOrderType(type);
    router.push("/menu");
  };

  return (
<div className="min-h-screen bg-nyc-base light:bg-nyc-cream flex items-center justify-center px-6 transition-colors">
      <div className="max-w-md w-full text-center">
        <h1 className="font-display text-2xl md:text-3xl text-nyc-cream light:text-nyc-base mb-10">{t.title}</h1>
        <div className="space-y-4">
          {options.map((opt) => (
           <button
  key={opt.type}
  onClick={() => handleSelect(opt.type)}
  className="w-full flex items-center gap-4 p-5 rounded-xl bg-nyc-cream/5 light:bg-nyc-base/5 border border-nyc-gold/20 hover:border-nyc-gold/60 hover:bg-nyc-cream/10 light:hover:bg-nyc-base/10 transition text-left"
>
<opt.icon size={26} strokeWidth={1.5} className="text-nyc-gold flex-shrink-0" />
  <div>
    <p className="text-nyc-cream light:text-nyc-base font-medium">{opt.label}</p>
    <p className="text-nyc-taupe text-sm">{opt.desc}</p>
  </div>
</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrderOnlinePage() {
 return <OrderOnlineContent />
}
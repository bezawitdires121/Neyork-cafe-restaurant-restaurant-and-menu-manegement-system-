"use client";

import Link from "next/link";
import { ShoppingCart, BellRing } from "lucide-react";

export default function MenuQuickActions({ cartCount }: { cartCount: number }) {
  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-3">
      <Link
        href="/call-waiter"
        className="relative w-12 h-12 rounded-full bg-nyc-base light:bg-nyc-cream border border-nyc-gold/30 shadow-lg flex items-center justify-center hover:border-nyc-gold/60 transition-colors"
      >
        <BellRing size={19} className="text-nyc-gold" strokeWidth={1.75} />
        <span className="absolute inset-0 rounded-full bg-nyc-gold/20 animate-ping" />
      </Link>

      <Link
        href="/order"
        className="relative w-14 h-14 rounded-full bg-nyc-gold shadow-xl flex items-center justify-center hover:brightness-110 transition-all active:scale-95"
      >
        <ShoppingCart size={22} className="text-nyc-base" strokeWidth={1.75} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-nyc-wine text-nyc-cream text-[11px] font-semibold flex items-center justify-center border-2 border-nyc-base light:border-nyc-cream">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>
    </div>
  );
}
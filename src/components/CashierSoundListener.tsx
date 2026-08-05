"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { playCashierChime } from "@/lib/notification-sound";
export default function CashierSoundListener({
  orderCount,
  waiterCount,
}: {
  orderCount: number;
  waiterCount: number;
}) {
  const prevOrders = useRef(orderCount);
  const prevWaiter = useRef(waiterCount);
  const router = useRouter();
  const [toast, setToast] = useState<"order" | "waiter" | null>(null);

  const beep = () => {
    playCashierChime();
  };

  useEffect(() => {
    if (orderCount > prevOrders.current) {
      beep();
      setToast("order");
      setTimeout(() => setToast(null), 4000);
    } else if (waiterCount > prevWaiter.current) {
      beep();
      setToast("waiter");
      setTimeout(() => setToast(null), 4000);
    }
    prevOrders.current = orderCount;
    prevWaiter.current = waiterCount;
  }, [orderCount, waiterCount]);

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 8000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className="fixed top-5 left-1/2 z-50 flex items-center gap-3 bg-nyc-base border border-nyc-gold/40 rounded-full px-5 py-3 shadow-xl"
        >
          {toast === "order" ? (
            <ShoppingBag size={16} className="text-nyc-gold" />
          ) : (
            <Bell size={16} className="text-nyc-gold" />
          )}
          <span className="text-nyc-cream text-sm font-medium">
            {toast === "order" ? "New order received" : "New waiter request"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
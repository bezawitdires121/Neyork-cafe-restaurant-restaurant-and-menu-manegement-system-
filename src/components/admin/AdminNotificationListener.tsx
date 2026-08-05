"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Counts = { reviews: number; messages: number };

export default function AdminNotificationListener({ initial }: { initial: Counts }) {
  const prevCounts = useRef<Counts>(initial);
  const [toast, setToast] = useState<{ type: "review" | "message" } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/admin/notification-counts");
        const data: Counts = await res.json();

        if (data.reviews > prevCounts.current.reviews) {
          setToast({ type: "review" });
          setTimeout(() => setToast(null), 4000);
          router.refresh();
        } else if (data.messages > prevCounts.current.messages) {
          setToast({ type: "message" });
          setTimeout(() => setToast(null), 4000);
          router.refresh();
        }

        prevCounts.current = data;
      } catch {
        // silent fail — don't disrupt admin workflow over a polling hiccup
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className="fixed top-5 left-1/2 z-50 flex items-center gap-3 bg-nyc-base border border-nyc-gold/30 rounded-full px-5 py-3 shadow-lg"
        >
          {toast.type === "review" ? (
            <Star size={16} className="text-nyc-gold" />
          ) : (
            <MessageSquare size={16} className="text-nyc-gold" />
          )}
          <span className="text-nyc-cream text-sm">
            {toast.type === "review" ? "New review submitted" : "New message received"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
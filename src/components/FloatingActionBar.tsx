"use client";

import { Phone, MapPin, Utensils } from "lucide-react";

export default function FloatingActionBar() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div
        className="
          flex items-center gap-0.5
          bg-white/10 dark:bg-black/25
          backdrop-blur-xl
          border border-black/10 dark:border-white/10
          rounded-full
          px-1 py-1
          shadow-lg
        "
      >

        {/* Call */}
        <a
          href="tel:+251000000000"
          aria-label="Call"
          className="
            w-8 h-8 rounded-full
            flex items-center justify-center
            text-nyc-base dark:text-nyc-cream
            hover:bg-nyc-gold/50
            transition
          "
        >
          <Phone size={15} strokeWidth={1.75} />
        </a>


        {/* Location */}
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=11.590244,37.389393"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Location"
          className="
            w-8 h-8 rounded-full
            flex items-center justify-center
            text-nyc-base dark:text-nyc-cream
            hover:bg-nyc-gold/50
            transition
          "
        >
          <MapPin size={15} strokeWidth={1.75} />
        </a>


        {/* Menu */}
        <a
          href="/menu"
          aria-label="Menu"
          className="
            w-8 h-8 rounded-full
            flex items-center justify-center
            text-nyc-base dark:text-nyc-cream
            hover:bg-nyc-gold/50
            transition
          "
        >
          <Utensils  size={15} strokeWidth={1.75} />
        </a>

      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LocationMap from "./LocationMap";
import { useLanguage } from "@/lib/language-context";

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const t = {
  en: { tag: "Visit Us", open: "Open Now", closed: "Closed Now", directions: "Get Directions", contact: "Contact Us" },
  am: { tag: "ይጎብኙን", open: "አሁን ክፍት ነው", closed: "አሁን ዝግ ነው", directions: "አቅጣጫ ያግኙ", contact: "ያግኙን" },
};

function isOpenNow(hours: Record<string, string>): boolean {
  const now = new Date();
  const key = dayKeys[now.getDay()];
  const todayHours = hours[key];
  if (!todayHours) return false;

  const match = todayHours.match(/(\d+):(\d+)\s*(AM|PM).*?(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return false;

  const to24 = (h: string, m: string, ap: string) => {
    let hour = parseInt(h);
    if (ap.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (ap.toUpperCase() === "AM" && hour === 12) hour = 0;
    return hour * 60 + parseInt(m);
  };

  const openMin = to24(match[1], match[2], match[3]);
  const closeMin = to24(match[4], match[5], match[6]);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  return nowMin >= openMin && nowMin < closeMin;
}

export default function VisitUs({
  hours,
  address,
  phone,
  lat,
  lng,
}: {
  hours: Record<string, string>;
  address?: string | null;
  phone?: string | null;
  lat?: number | null;
  lng?: number | null;
}) {
  const { lang } = useLanguage();
  const tr = t[lang];
  const open = isOpenNow(hours);

  return (
    <section className="bg-nyc-base dark:bg-nyc-base light:bg-nyc-cream py-20 px-6">
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

    {/* Left Content */}
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <p className="text-nyc-gold-light text-sm tracking-[0.3em] uppercase mb-3">
        {tr.tag}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            open ? "bg-green-400" : "bg-red-400"
          }`}
        />

        <span className="text-nyc-cream dark:text-nyc-cream light:text-nyc-base font-medium">
          {open ? tr.open : tr.closed}
        </span>
      </div>

      {address && (
        <p className="text-nyc-taupe mb-1">
          {address}
        </p>
      )}

      {phone && (
        <p className="text-nyc-taupe mb-6">
          {phone}
        </p>
      )}

      <div className="flex gap-3">
        {lat && lng && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-nyc-gold text-nyc-base text-sm font-medium transition-all duration-300 hover:bg-nyc-gold-light hover:shadow-lg hover:shadow-nyc-gold/20"
          >
            {tr.directions}
          </a>
        )}

        <Link
          href="/contact"
          className="px-5 py-2.5 rounded-full border border-nyc-gold text-nyc-gold text-sm font-medium transition-all duration-300 hover:bg-nyc-gold/10 hover:border-nyc-gold-light hover:text-nyc-gold-light"
        >
          {tr.contact}
        </Link>
      </div>
    </motion.div>


    {/* Map */}
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
    >
      {lat && lng && <LocationMap lat={lat} lng={lng} />}
    </motion.div>

  </div>
</section>
  );
}
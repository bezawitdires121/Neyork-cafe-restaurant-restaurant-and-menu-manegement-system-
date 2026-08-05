"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

const t = {
  en: {
    established: "Est. Bahir Dar",
    description:
      "Where classic New York flavor meets Ethiopian hospitality.",
    viewMenu: "View Menu",
    orderNow: "Order Now",
    location: "Location",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    restaurantName: " Welcome to New York Cafe & Restaurant",
  },

  am: {
    established: "የተመሰረተው ባህር ዳር",
    description:
      "የኒው ዮርክ ጣዕም ከኢትዮጵያዊ እንግዳ ተቀባይነት ጋር የሚገናኙበት ቦታ።",
    viewMenu: "ምናሌ ይመልከቱ",
    orderNow: "አሁን ይዘዙ",
    location: "አቅጣጫ",
    instagram: "ኢንስታግራም",
    facebook: "ፌስቡክ",
    tiktok: "ቲክቶክ",
    restaurantName: "ኒው ዮርክ ካፌ እና ሬስቶራንት",
  },
};

export default function HeroSection({
  name,
  nameAm,
  socialLinks,
}: {
  name: string;
  nameAm?: string | null;
  socialLinks: Record<string, string>;
}) {
  const { theme } = useTheme();
  const { lang } = useLanguage();

  const tr = t[lang];

  return (
    <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>


      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-black/60"
            : "bg-black/40"
        }`}
      />


      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, #b8862b, transparent 60%)",
        }}
      />


      <motion.div
        className="relative z-10 max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >

        <p className="text-nyc-gold-light text-sm tracking-[0.3em] uppercase mb-4">
          {tr.established}
        </p>


        <h1 className="font-display text-3xl md:text-6xl text-nyc-cream mb-3">
          {lang === "en" ? name : nameAm || tr.restaurantName}
        </h1>


        


        <p className="text-nyc-taupe text-lg mb-10">
          {tr.description}
        </p>


        <div className="flex flex-wrap justify-center gap-4 mb-10">

          <Link
            href="/menu"
            className="
              px-6 py-3
              rounded-full
              bg-nyc-gold
              text-nyc-base
              font-medium
              transition-all duration-300
              hover:bg-nyc-gold-light
              hover:shadow-lg hover:shadow-nyc-gold/20
            "
          >
            {tr.viewMenu}
          </Link>


          <Link
            href="/order-online"
            className="
              px-6 py-3
              rounded-full
              border border-nyc-gold
              text-nyc-gold
              font-medium
              transition-all duration-300
              hover:bg-nyc-gold/10
              hover:border-nyc-gold-light
              hover:text-nyc-gold-light
            "
          >
            {tr.orderNow}
          </Link>

        </div>


        <div className="flex justify-center gap-5 text-nyc-taupe text-sm">

          {socialLinks.instagram && (
            <a href={socialLinks.instagram}>
              {tr.instagram}
            </a>
          )}

          {socialLinks.facebook && (
            <a href={socialLinks.facebook}>
              {tr.facebook}
            </a>
          )}

          {socialLinks.tiktok && (
            <a href={socialLinks.tiktok}>
              {tr.tiktok}
            </a>
          )}


          <a
            href="https://www.google.com/maps/dir/?api=1&destination=11.590244,37.389393"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-nyc-gold transition"
          >
            <MapPin size={16} strokeWidth={1.75} />
            {tr.location}
          </a>

        </div>

      </motion.div>

    </section>
  );
}
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  menuItem: {
    nameEn: string;
    nameAm: string;
  } | null;
};

const t = {
  en: {
    tag: "Loved by Locals",
    title: "What People Are Saying",
    cta: "See All Reviews",
    onWord: "on",
  },
  am: {
    tag: "በአካባቢው ሰዎች የተወደደ",
    title: "ሰዎች የሚሉት",
    cta: "ሁሉንም ግምገማዎች ይመልከቱ",
    onWord: "ላይ",
  },
};

export default function LovedByLocals({
  reviews,
}: {
  reviews: Review[];
}) {
  const { lang } = useLanguage();
  const tr = t[lang];

  if (reviews.length === 0) return null;

  return (
    <section className="bg-nyc-base light:bg-nyc-cream py-20 px-6">
  <div className="max-w-6xl mx-auto">

    {/* Heading */}
    <motion.div
      className="text-center mb-12 rounded-[var(--radius-panel)] bg-nyc-cream/[0.03] light:bg-nyc-base/[0.03] border border-nyc-gold/10 p-8 sm:p-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <p className="text-nyc-gold-light light:text-nyc-gold text-sm tracking-[0.3em] uppercase mb-3">
        {tr.tag}
      </p>

      <h2 className="font-display text-3xl md:text-4xl text-nyc-cream light:text-nyc-base">
        {tr.title}
      </h2>
    </motion.div>


    {/* Reviews */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {reviews.map((r, index) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.15,
            ease: "easeOut",
          }}
          className="bg-nyc-cream/5 light:bg-white rounded-2xl p-6 border border-nyc-gold/15 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-nyc-gold/40 hover:shadow-lg"
        >
          <p className="text-nyc-gold text-lg tracking-wide mb-3">
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)}
          </p>

          {r.comment && (
            <p className="text-nyc-taupe light:text-nyc-base/80 leading-7 italic mb-4">
              &ldquo;{r.comment}&rdquo;
            </p>
          )}

          {r.menuItem && (
            <p className="text-nyc-gold-light text-xs uppercase tracking-wider">
              {tr.onWord}{" "}
              {lang === "en"
                ? r.menuItem.nameEn
                : r.menuItem.nameAm}
            </p>
          )}

        </motion.div>
      ))}
    </div>


    {/* CTA */}
    <motion.div
      className="text-center mt-12"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: 0.2,
      }}
    >
      <Link
        href="/reviews"
        className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-nyc-gold text-nyc-gold text-sm font-medium transition-all duration-300 hover:bg-nyc-gold/10 hover:border-nyc-gold-light hover:text-nyc-gold-light"
      >
        {tr.cta}
      </Link>
    </motion.div>

   </div>
</section>
  );
}
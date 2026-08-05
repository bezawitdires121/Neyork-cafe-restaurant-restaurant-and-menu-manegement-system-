"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

type Dish = {
  id: string;
  nameEn: string;
  nameAm: string;
  descEn: string | null;
  descAm: string | null;
  priceETB: number;
  imageUrl: string | null;
};

const t = {
  en: {
    tag: "Fan Favorites",
    title: "Most Loved Dishes",
    cta: "View Full Menu",
  },
  am: {
    tag: "የተወደዱ",
    title: "በጣም የተወደዱ ምግቦች",
    cta: "ሙሉ ምናሌ ይመልከቱ",
  },
};

export default function MostLovedDishes({
  dishes,
}: {
  dishes: Dish[];
}) {
  const { lang } = useLanguage();
  const tr = t[lang];

  if (dishes.length === 0) return null;

  return (
    <section className="bg-nyc-base dark:bg-nyc-base light:bg-nyc-cream py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-12 rounded-[var(--radius-panel)] bg-nyc-cream/[0.03] light:bg-nyc-base/[0.03] border border-nyc-gold/10 p-8 sm:p-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-nyc-gold-light light:text-nyc-gold text-sm tracking-[0.3em] uppercase mb-3">
            {tr.tag}
          </p>

          <h2 className="font-display text-3xl md:text-4xl text-nyc-cream dark:text-nyc-cream light:text-nyc-base">
            {tr.title}
          </h2>
        </motion.div>

        {/* Dishes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
              }}
              className="overflow-hidden rounded-2xl bg-nyc-cream/5 light:bg-white border border-nyc-gold/15 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-nyc-gold/40 hover:shadow-lg"
            >
              {dish.imageUrl && (
                <div className="relative w-full h-56 overflow-hidden">
                  <Image
                    src={dish.imageUrl}
                    alt={lang === "en" ? dish.nameEn : dish.nameAm}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="font-display text-xl text-nyc-cream dark:text-nyc-cream light:text-nyc-base mb-2">
                  {lang === "en" ? dish.nameEn : dish.nameAm}
                </h3>

                {(lang === "en" ? dish.descEn : dish.descAm) && (
                  <p className="text-nyc-taupe leading-7 text-sm mb-4 line-clamp-2">
                    {lang === "en" ? dish.descEn : dish.descAm}
                  </p>
                )}

                <p className="text-nyc-gold text-lg font-semibold">
                  {dish.priceETB} ETB
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-nyc-gold text-nyc-gold text-sm font-medium transition-all duration-300 hover:bg-nyc-gold/10 hover:border-nyc-gold-light hover:text-nyc-gold-light"
          >
            {tr.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
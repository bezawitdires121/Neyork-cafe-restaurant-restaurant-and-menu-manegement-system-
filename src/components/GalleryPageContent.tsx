"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

type Img = { id: string; imageUrl: string; caption: string | null };

const t = {
  en: {
    tag: "A Visual Story",
    title: "Gallery",
    empty: "Gallery coming soon.",
    ctaTitle: "Come See It in Person",
    viewMenu: "View Menu",
    orderOnline: "Order Now",
  },
  am: {
    tag: "የምስል ታሪክ",
    title: "ማዕከለ-ስዕላት",
    empty: "ማዕከለ-ስዕላት በቅርቡ ይመጣል።",
    ctaTitle: "በአካል ይጎብኙን",
    viewMenu: "ምናሌ ይመልከቱ",
    orderOnline: "አሁን ይዘዙ",
  },
};

export default function GalleryPageContent({ images }: { images: Img[] }) {
  const { lang } = useLanguage();
  const tr = t[lang];

  return (
    <>
      <motion.section
  className="pt-32 pb-16 px-6 bg-nyc-base dark:bg-nyc-base light:bg-nyc-cream text-center"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
>
        <p className="text-nyc-gold-light text-sm tracking-[0.3em] uppercase mb-3">{tr.tag}</p>
        <h1 className="font-display text-4xl md:text-5xl text-nyc-cream dark:text-nyc-cream light:text-nyc-base">
          {tr.title}
        </h1>
</motion.section>

      <section className="bg-nyc-base dark:bg-nyc-base light:bg-nyc-cream pb-20 px-6">
  <div className="max-w-6xl mx-auto">

    {images.length === 0 ? (
      <p className="text-center text-nyc-taupe">{tr.empty}</p>
    ) : (
      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {images.map((img, index) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            className="relative rounded-xl overflow-hidden break-inside-avoid"
          >
            <Image
              src={img.imageUrl}
              alt={img.caption ?? "Restaurant photo"}
              width={500}
              height={500}
              className="w-full h-auto object-cover"
            />

            {img.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-nyc-base/70 backdrop-blur-sm text-nyc-cream text-xs p-2">
                {img.caption}
              </p>
            )}

          </motion.div>
        ))}
      </div>
    )}

  </div>
</section>


<motion.section
  className="bg-nyc-cream py-24 px-6"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
>
  <motion.div
    className="max-w-4xl mx-auto bg-nyc-gold/10 rounded-[32px] p-10 md:p-14 text-center border border-nyc-gold/20"
    initial={{ opacity: 0, scale: 0.96 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >

    <h2 className="font-display text-3xl md:text-4xl text-nyc-base mb-4">
      {lang === "en" ? "A Feast for the Eyes" : "ለዓይን የሚያምር ዕይታ"}
    </h2>

    <p className="text-nyc-base/80 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
      {lang === "en"
        ? "Explore the moments, flavors, and atmosphere that make every visit to New York Café & Restaurant unforgettable."
        : "የኒው ዮርክ ካፌ እና ሬስቶራንትን ልዩ የሚያደርጉትን ድባብ፣ ምግቦች እና የማይረሱ አፍታዎች ይመልከቱ።"}
    </p>

    <div className="flex flex-wrap justify-center gap-4">

      <Link
        href="/menu"
        className="inline-block px-8 py-3.5 rounded-full bg-nyc-gold text-nyc-base font-medium hover:bg-nyc-gold-light transition"
      >
        {tr.viewMenu}
      </Link>

      <Link
        href="/order-online"
        className="inline-block px-8 py-3.5 rounded-full bg-nyc-gold text-nyc-base font-medium hover:bg-nyc-gold-light transition"
      >
        {tr.orderOnline}
      </Link>

    </div>

  </motion.div>
</motion.section>
    </>
  );
}
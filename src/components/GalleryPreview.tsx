"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { motion } from "framer-motion";
type Img = { id: string; imageUrl: string; caption: string | null };

const t = {
  en: { tag: "A Visual Story", title: "Gallery", cta: "View Gallery" },
  am: { tag: "የምስል ታሪክ", title: "ማዕከለ-ስዕላት", cta: "ማዕከለ-ስዕላቱን ይመልከቱ" },
};

export default function GalleryPreview({ images }: { images: Img[] }) {
  const { lang } = useLanguage();
  const tr = t[lang];

  if (images.length === 0) return null;

  return (
    <section className="bg-nyc-base dark:bg-nyc-base light:bg-nyc-cream py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
  className="text-center mb-12"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
          <p className="text-nyc-gold-light text-sm tracking-[0.3em] uppercase mb-3">{tr.tag}</p>
          <h2 className="font-display text-3xl md:text-4xl text-nyc-cream dark:text-nyc-cream light:text-nyc-base">
            {tr.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
      className="relative aspect-square rounded-xl overflow-hidden"
    >
              <Image src={img.imageUrl} alt={img.caption ?? "Gallery image"} fill className="object-cover" />
            </motion.div>
          ))}
        </div>

       <motion.div
  className="text-center mt-12"
  initial={{ opacity: 0, y: 25 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
          <Link
  href="/gallery"
  className="
    inline-flex items-center justify-center
    px-6 py-3
    rounded-full
    border border-nyc-gold
    text-nyc-gold
    text-sm font-medium
    transition-all duration-300
    hover:bg-nyc-gold/10
    hover:border-nyc-gold-light
    hover:text-nyc-gold-light
  "
>
  {tr.cta}
</Link>
               </motion.div>
      </div>
    </section>
  );
}
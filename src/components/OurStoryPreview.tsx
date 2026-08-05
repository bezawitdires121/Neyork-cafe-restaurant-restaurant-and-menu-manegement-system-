"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

const t = {
  en: {
    tag: "Our Story",
    title: "A Little About Us",
    fallback: "Born from a love of the New York diner spirit and the warmth of Ethiopian hospitality, our story is one of two cultures meeting over good food and better company.",
    cta: "Read Our Story",
  },
  am: {
    tag: "ታሪካችን",
    title: "ስለ እኛ በአጭሩ",
    fallback: "ከኒው ዮርክ ዳይነር መንፈስ ፍቅር እና ከኢትዮጵያዊ እንግዳ ተቀባይነት ሙቀት የተወለደ ታሪካችን ሁለት ባህሎች በጥሩ ምግብና በተሻለ ጓደኝነት የሚገናኙበት ነው።",
    cta: "ታሪካችንን ያንብቡ",
  },
};

export default function OurStoryPreview({ story }: { story?: string | null }) {
  const { lang } = useLanguage();
  const tr = t[lang];

  return (
    <section className="bg-nyc-base light:bg-nyc-cream py-20 px-6">
  <div className="max-w-2xl mx-auto text-center rounded-[var(--radius-panel)] bg-nyc-cream/[0.03] light:bg-nyc-base/[0.03] border border-nyc-gold/10 p-8 sm:p-10">
    <p className="text-nyc-gold-light light:text-nyc-gold text-sm tracking-[0.3em] uppercase mb-3">{tr.tag}</p>
   <h2 className="font-display text-3xl md:text-4xl text-nyc-cream light:text-nyc-base mb-6">
          {tr.title}
        </h2>
        <p className="text-nyc-cream/70 light:text-nyc-base/70 text-lg mb-8 leading-relaxed">
          {story || tr.fallback}
        </p>
        <Link
  href="/about"
  className="
    inline-flex items-center justify-center
    px-6 py-3
    rounded-full
    border border-nyc-gold
    text-nyc-gold
    dark:text-nyc-gold
    light:text-nyc-gold
    text-sm font-medium
    transition-all duration-300
    hover:bg-nyc-gold/10
    hover:border-nyc-gold-light
    hover:text-nyc-gold-light
  "
>
  {tr.cta}
</Link>
      </div>
    </section>
  );
}
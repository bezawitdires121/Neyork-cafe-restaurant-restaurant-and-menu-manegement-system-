"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";

const t = {
  en: {
    tag: "",
    title: "About Us",
    ourStoryTitle: "Our Story",
    storyFallback:
      "Born from a love of the New York diner spirit and the warmth of Ethiopian hospitality, our story is one of two cultures meeting over good food and better company.",
    vibeTitle: "Our Vibe",
    vibeText:
      "Warm lighting, brass accents, and the low hum of good conversation - our space is built for lingering. Whether you're here for a quiet coffee or a full dinner with friends, the atmosphere adapts to you.",
    setsApartTitle: "What Sets Us Apart",
    features: [
      { title: "Quality Food", desc: "Fresh ingredients, thoughtfully prepared, every single day." },
      { title: "Beautiful Interior", desc: "A space designed for comfort, warmth, and good conversation." },
      { title: "Fast Service", desc: "Attentive staff who respect your time without rushing your meal." },
      { title: "True Hospitality", desc: "Every guest treated like family, from the first visit onward." },
    ],
    ctaTitle: "Step Into Our World of Flavor, Comfort and Hospitality and Create Your Own Dining Experience With Us!",
    ctaButton: "View Menu",
  },
  am: {
    tag: "",
    title: "ስለ እኛ",
    ourStoryTitle: "ታሪካችን",
    storyFallback:
      "ከኒው ዮርክ ዳይነር መንፈስ ፍቅር እና ከኢትዮጵያዊ እንግዳ ተቀባይነት ሙቀት የተወለደ ታሪካችን ሁለት ባህሎች በጥሩ ምግብና በተሻለ ጓደኝነት የሚገናኙበት ነው።",
    vibeTitle: "የእኛ ስሜት",
    vibeText:
      "ሞቅ ያለ መብራት፣ የናስ ያሸበረቀ ውበት፣ እና ጥሩ ውይይት ድምጽ - ቦታችን ለመቆየት እንዲመች ተደርጎ የተሰራ ነው። ጸጥ ያለ ቡና ለመጠጣት ወይም ከጓደኞች ጋር ሙሉ እራት ለመብላት ቢመጡ፣ ድባቡ ለእርስዎ ይስማማል።",
    setsApartTitle: "የእኛን ልዩ የሚያደርገው",
    features: [
      { title: "ጥራት ያለው ምግብ", desc: "ትኩስ ግብዓቶች፣ በጥንቃቄ የተዘጋጁ፣ በየቀኑ።" },
      { title: "ውብ ውስጠኛ ክፍል", desc: "ለምቾት፣ ለሙቀት እና ለጥሩ ውይይት የተነደፈ ቦታ።" },
      { title: "ፈጣን አገልግሎት", desc: "ምግብዎን ሳያቻኩሉ ጊዜዎን የሚያከብሩ ትኩረት ያላቸው ሰራተኞች።" },
      { title: "እውነተኛ እንግዳ ተቀባይነት", desc: "ከመጀመሪያው ጉብኝት ጀምሮ እያንዳንዱ እንግዳ እንደ ቤተሰብ ይስተናገዳል።" },
    ],
    ctaTitle: "ጥሩ ምግብ፣ ምቹ አካባቢ እና ሞቅ ያለ እንግዳ ተቀባይነት የሚያገኙበትን ልዩ ልምድ ከእኛ ጋር ይፍተሩ።",
    ctaButton: "ምናሌ ይመልከቱ",
  },
};

export default function AboutContent({ story }: { story?: string | null }) {
  const { lang } = useLanguage();
  const tr = t[lang];

  return (
    <>
   <section
  className="relative min-h-[420px] flex items-center justify-center px-6 text-center bg-cover bg-center"
  style={{ backgroundImage: "url('/images/about-bg.jpg')" }}
>
  <div className="absolute inset-0 bg-black/60" />

  <motion.div
  className="relative z-10 max-w-2xl mx-auto"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
>
    <p className="text-nyc-gold-light text-sm tracking-[0.3em] uppercase mb-4">
      {lang === "en" ? "Get To Know Us" : "ስለ እኛ ይወቁ"}
    </p>

    <h1 className="font-display text-4xl md:text-5xl text-nyc-cream">
      {tr.title}
    </h1>
  </motion.div>
</section>
 
  <section className="mt-16 bg-nyc-base dark:bg-nyc-base light:bg-nyc-cream py-20 px-6">
    
  <motion.div
  className="max-w-4xl mx-auto text-center"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>

    <h2 className="font-display text-3xl text-nyc-cream dark:text-nyc-cream light:text-nyc-base mb-6">
      {tr.ourStoryTitle}
    </h2>

    <p className="text-nyc-taupe text-lg leading-relaxed max-w-2xl mx-auto">
      {story || tr.storyFallback}
    </p>

  </motion.div>
</section>
<motion.div
  className="relative w-full max-w-3xl h-[350px] mx-auto overflow-hidden my-20"
  initial={{ opacity: 0, scale: 0.96 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  <img
    src="/images/ab2.jpg"
    alt="Our restaurant"
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/20" />
</motion.div>




<section className="bg-nyc-base dark:bg-nyc-base light:bg-nyc-cream py-20 px-6">
  <motion.div
  className="max-w-4xl mx-auto text-center"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.6 }}
>
    <h2 className="font-display text-3xl text-nyc-cream dark:text-nyc-cream light:text-nyc-base mb-6">
      {tr.vibeTitle}
    </h2>

    <p className="text-nyc-taupe text-lg leading-relaxed max-w-2xl mx-auto">
      {tr.vibeText}
    </p>
  </motion.div>
</section>


<section className="bg-nyc-gold/23 py-20 px-6">
 <motion.div
  className="max-w-5xl mx-auto"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>

    <h2 className="font-display text-3xl text-nyc-base text-center mb-12">
      {tr.setsApartTitle}
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

    {tr.features.map((f, index) => (
      <motion.div
  key={f.title}
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{
    duration: 0.5,
    delay: index * 0.12,
  }}
  className="bg-white rounded-xl p-6 border border-nyc-gold/20 text-center shadow-sm"
>
          <h3 className="font-display text-lg text-nyc-base mb-2">
            {f.title}
          </h3>

          <p className="text-nyc-base/70 text-sm leading-relaxed">
            {f.desc}
          </p>
        </motion.div>
      ))}

    </div>

  </motion.div>
</section>


  {/* Dine Image */}<motion.div
  className="relative w-full max-w-3xl h-[350px] mx-auto overflow-hidden my-20"
  initial={{ opacity: 0, scale: 0.96 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  <img
    src="/images/dine.jpg"
    alt="Dining experience"
    className="w-full h-full object-cover"
  />

  <div className="absolute inset-0 bg-black/20" />
</motion.div>


  {/* CTA */}
 <section className="bg-nyc-cream py-24 px-6">
  <motion.div
  className="max-w-4xl mx-auto bg-nyc-gold/10 rounded-[32px] p-10 md:p-14 text-center border border-nyc-gold/22"
  initial={{ opacity: 0, y: 40, scale: 0.96 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>

    <h2 className="font-display text-lg md:text-xl text-nyc-base mb-6">
      {tr.ctaTitle}
    </h2>

    <Link
      href="/menu"
      className="inline-block px-8 py-3.5 rounded-full bg-nyc-gold text-nyc-base font-medium hover:bg-nyc-gold-light transition"
    >
      {tr.ctaButton}
    </Link>

  </motion.div>
</section>

    </>
  );
}
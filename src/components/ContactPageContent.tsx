"use client";

import { useLanguage } from "@/lib/language-context";
import LocationMap from "@/components/LocationMap";
import ContactForm from "@/components/ContactForm";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";
import CopyAddressButton from "@/components/CopyAddressButton";
import { toEthiopianRange } from "@/lib/ethiopian-time";
const t = {
  en: {
    tag: "Get in Touch",
    title: "Contact Us",
    address: "Address",
    phone: "Phone",
    email: "Email",
    hours: "Hours",
    addressSoon: "Address coming soon",
    soon: "Coming soon",
    directions: "Get Directions",
    sendMessage: "Send Us a Message",
    followUs: "Follow Us",
  },
  am: {
    tag: "ያግኙን",
    title: "አድራሻ",
    address: "አድራሻ",
    phone: "ስልክ",
    email: "ኢሜይል",
    hours: "የስራ ሰዓት",
    addressSoon: "አድራሻ በቅርቡ",
    soon: "በቅርቡ",
    directions: "አቅጣጫ ያግኙ",
    sendMessage: "መልእክት ይላኩልን",
    followUs: "ይከተሉን",
  },
};

type Restaurant = {
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  latitude?: number | null;
  longitude?: number | null;
} | null;

export default function ContactPageContent({
  restaurant,
  social,
  hours,
}: {
  restaurant: Restaurant;
  social: Record<string, string>;
  hours: Record<string, string>;
}) {
  const { lang } = useLanguage();
  const tr = t[lang];

  return (
    <>
      {/* Hero */}
<section
  className="relative pt-36 pb-28 px-6 text-center bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/view.jpg')",
  }}
>
  {/* Overlay */}
 <div className="absolute inset-0 bg-black/60" />

  <motion.div
  className="relative z-10 max-w-4xl mx-auto"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
>

<p className="text-nyc-gold-light text-sm tracking-[0.3em] uppercase mb-4">{tr.tag}</p>
    <h1 className="font-display text-4xl md:text-5xl text-nyc-cream">{tr.title}</h1>




  </motion.div>
</section>

      <section className="bg-nyc-cream dark:bg-nyc-base pb-16 pt-16 px-6">
       <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          

                 <div className="bg-nyc-cream/5 light:bg-nyc-base/5 border border-nyc-gold/20 rounded-xl p-5">
  <p className="text-nyc-gold-light text-xs uppercase tracking-wider mb-2">
    {tr.address}
  </p>

  <div className="flex items-center justify-between gap-3">
    <p className="text-nyc-base dark:text-nyc-cream text-sm">
      {restaurant?.address || tr.addressSoon}
    </p>

    {restaurant?.address && (
      <CopyAddressButton address={restaurant.address} />
    )}
  </div>
</div>


 <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
 transition={{
  duration: 0.5,
  delay: 0.1
}}
  className="bg-nyc-cream/5 light:bg-nyc-base/5 border border-nyc-gold/20 rounded-xl p-5"
>
            <p className="text-nyc-gold-light text-xs uppercase tracking-wider mb-2">{tr.phone}</p>
            <p className="text-nyc-cream dark:text-nyc-cream light:text-nyc-base text-sm">
              {restaurant?.phone || tr.soon}
            </p>
          </motion.div>
        <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="bg-nyc-cream/5 light:bg-nyc-base/5 border border-nyc-gold/20 rounded-xl p-5"
>
            <p className="text-nyc-gold-light text-xs uppercase tracking-wider mb-2">{tr.email}</p>
            <p className="text-nyc-cream dark:text-nyc-cream light:text-nyc-base text-sm">
              {restaurant?.email || tr.soon}
            </p>
          </motion.div>
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{
    duration: 0.5,
    delay: 0.3
  }}
  className="bg-nyc-cream/5 light:bg-nyc-base/5 border border-nyc-gold/20 rounded-xl p-5"
>
  <p className="text-nyc-gold-light text-xs uppercase tracking-wider mb-2">
    {tr.hours}
  </p>

  <p className="text-nyc-cream dark:text-nyc-cream light:text-nyc-base text-sm">
    {hours.mon ? (lang === "am" ? toEthiopianRange(hours.mon) : hours.mon) : tr.soon}
  </p>

</motion.div>
      
   </div>  

  {/* Social Media */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="max-w-5xl mx-auto mt-8"
>
  <div className="bg-nyc-gold/5 dark:bg-nyc-gold/5 border border-nyc-gold/20 rounded-xl p-4 text-center">

    <p className="text-nyc-gold-light text-xs uppercase tracking-wider mb-3">
      {tr.followUs}
    </p>

    <div className="flex justify-center gap-2">

      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
       className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
      >
        <FaInstagram size={16}/>
      </a>


      <a
        href="https://tiktok.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
      >
        <FaTiktok size={16}/>
      </a>

<a
  href="https://facebook.com"
  target="_blank"
  rel="noopener noreferrer"
  className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
>
  <FaFacebookF size={16}/>
</a>

      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
      >
        <FaWhatsapp size={16}/>
      </a>

    </div>

  </div>
</motion.div>
<div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">

  {/* Map */}
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
  >
    <div className="bg-nyc-gold/10 dark:bg-nyc-gold/5 border border-nyc-gold/20 rounded-[32px] p-6">
      <div className="overflow-hidden rounded-2xl h-full">
        {restaurant?.latitude && restaurant?.longitude && (
          <LocationMap
            lat={restaurant.latitude}
            lng={restaurant.longitude}
          />
        )}
      </div>
    </div>
  </motion.div>


  {/* Contact Form */}
  <motion.div
    initial={{ opacity: 0, x: 40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
  >
    <div className="bg-nyc-gold/10 dark:bg-nyc-gold/5 border border-nyc-gold/20 rounded-[32px] p-8">
      <div className="text-center mb-8">
        <p className="text-nyc-gold text-sm tracking-[0.3em] uppercase mb-3">
          Contact
        </p>

        <h2 className="font-display text-3xl md:text-4xl text-nyc-base dark:text-nyc-cream">
          {tr.sendMessage}
        </h2>
      </div>

      <ContactForm />
    </div>
  </motion.div>

</div>
   
    </section>
    </>
  );
}
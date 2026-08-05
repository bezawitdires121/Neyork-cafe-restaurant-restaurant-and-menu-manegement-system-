"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/lib/language-context";

const navLabels = {
  en: { home: "Home", about: "About", menu: "Menu", gallery: "Gallery", reviews: "Reviews", contact: "Contact" },
  am: { home: "መነሻ", about: "ስለ እኛ", menu: "ምናሌ", gallery: "ማዕከለ-ስዕላት", reviews: "ግምገማዎች", contact: "አድራሻ" },
};

export default function Navbar() {
 const [scrolled, setScrolled] = useState(false);
const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  const t = navLabels[lang];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
       scrolled
? "bg-nyc-base/80 dark:bg-nyc-base/80 light:bg-nyc-cream/80 backdrop-blur-xl shadow-md"
: "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
       <Link href="/" className="flex items-center">
 <Image
  src="/logo-navbar.png"
  alt="New York Cafe & Restaurant"
  width={48}
  height={48}
  className="rounded-full object-cover hover:scale-105 transition"
 />
</Link>

{/* Desktop Navigation */}
<div className="hidden lg:flex items-center gap-8">
  <Link href="/" className="hover:text-nyc-gold transition">
    {t.home}
  </Link>

  <Link href="/about" className="hover:text-nyc-gold transition">
    {t.about}
  </Link>

  <Link href="/menu" className="hover:text-nyc-gold transition">
    {t.menu}
  </Link>

  <Link href="/gallery" className="hover:text-nyc-gold transition">
    {t.gallery}
  </Link>

  <Link href="/reviews" className="hover:text-nyc-gold transition">
    {t.reviews}
  </Link>

  <Link href="/contact" className="hover:text-nyc-gold transition">
    {t.contact}
  </Link>
</div>


<div className="flex items-center gap-3">
  <LanguageToggle />
  <ThemeToggle />

  {/* Mobile Menu Button */}
 <button
  onClick={() => setOpen(!open)}
  className="lg:hidden text-nyc-gold p-2 rounded-full hover:bg-nyc-gold/10 transition"
>
  {open ? (
    <X size={24} strokeWidth={1.8} />
  ) : (
    <Menu size={24} strokeWidth={1.8} />
  )}
</button>
</div>
        
      </div>
      <AnimatePresence>
{open && (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.25 }}
   className="lg:hidden overflow-hidden bg-nyc-base/95 dark:bg-nyc-base/95 light:bg-[#F3E7D3]/95 backdrop-blur-xl border-t border-nyc-gold/20"
  >
<div className="flex flex-col px-6 py-5 gap-2">
     <Link
  href="/"
  onClick={() => setOpen(false)}
  className="py-3 px-4 rounded-xl hover:bg-nyc-gold/10 transition text-base"
>
        {t.home}
      </Link>

      <Link
  href="/about"
  onClick={() => setOpen(false)}
  className="py-3 px-4 rounded-xl hover:bg-nyc-gold/10 transition text-base"
>
        {t.about}
      </Link>

      <Link
  href="/menu"
  onClick={() => setOpen(false)}
  className="py-3 px-4 rounded-xl hover:bg-nyc-gold/10 transition text-base"
>
        {t.menu}
      </Link>

      <Link
  href="/gallery"
  onClick={() => setOpen(false)}
  className="py-3 px-4 rounded-xl hover:bg-nyc-gold/10 transition text-base"
>
        {t.gallery}
      </Link>

      <Link
  href="/reviews"
  onClick={() => setOpen(false)}
  className="py-3 px-4 rounded-xl hover:bg-nyc-gold/10 transition text-base"
>
        {t.reviews}
      </Link>

      <Link
  href="/contact"
  onClick={() => setOpen(false)}
  className="py-3 px-4 rounded-xl hover:bg-nyc-gold/10 transition text-base"
>
        {t.contact}
      </Link>
          </div>
    </motion.div>
  )}
</AnimatePresence>
    </nav>
  );
}
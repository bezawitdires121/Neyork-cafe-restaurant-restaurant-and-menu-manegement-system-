"use client";

import { useLanguage } from "@/lib/language-context";
import Link from "next/link";
import type { Restaurant } from "@prisma/client";

import Image from "next/image";
import {
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";
import { toEthiopianRange } from "@/lib/ethiopian-time";
const dayLabels: Record<string, { en: string; am: string }> = {
  mon: { en: "Monday", am: "ሰኞ" },
  tue: { en: "Tuesday", am: "ማክሰኞ" },
  wed: { en: "Wednesday", am: "ረቡዕ" },
  thu: { en: "Thursday", am: "ሐሙስ" },
  fri: { en: "Friday", am: "ዓርብ" },
  sat: { en: "Saturday", am: "ቅዳሜ" },
  sun: { en: "Sunday", am: "እሁድ" },
};

const t = {
  en: {
    quickLinks: "Quick Links",
    hours: "Hours",
    contact: "Contact",
    home: "Home", about: "About", menu: "Menu", gallery: "Gallery", reviews: "Reviews", contactLink: "Contact",
    viewMenu: "View Menu", orderOnline: "Order Now",
    socialsSoon: "Social links coming soon",
    hoursSoon: "Hours coming soon",
    rights: "All rights reserved.",
  },
  am: {
    quickLinks: "ፈጣን አገናኞች",
    hours: "የስራ ሰዓት",
    contact: "አድራሻ",
    home: "መነሻ", about: "ስለ እኛ", menu: "ምናሌ", gallery: "ማዕከለ-ስዕላት", reviews: "ግምገማዎች", contactLink: "አድራሻ",
    viewMenu: "ምናሌ ይመልከቱ", orderOnline: "አሁን ይዘዙ",
    socialsSoon: "የማህበራዊ ሚዲያ አገናኞች በቅርቡ",
    hoursSoon: "የስራ ሰዓት በቅርቡ",
    rights: "መብቱ በህግ የተጠበቀ ነው።",
  },
};



type SocialLinks = {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  whatsapp?: string;
};

type OpeningHours = Record<string, string>;

export default function Footer({
  restaurant,
}: {
  restaurant: Restaurant | null;
}) {
  const { lang } = useLanguage();
  const tr = t[lang];

  const hours: OpeningHours =
    restaurant?.openingHours &&
    typeof restaurant.openingHours === "object" &&
    !Array.isArray(restaurant.openingHours)
      ? (restaurant.openingHours as OpeningHours)
      : {};

  const social: SocialLinks =
    restaurant?.socialLinks &&
    typeof restaurant.socialLinks === "object" &&
    !Array.isArray(restaurant.socialLinks)
      ? (restaurant.socialLinks as SocialLinks)
      : {};




return (
  <footer className="bg-nyc-base dark:bg-nyc-base light:bg-[#F3E7D3] border-t border-nyc-gold/20 text-nyc-cream dark:text-nyc-cream light:text-nyc-base">
<div className="max-w-6xl mx-auto px-3 sm:px-6 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-10">

      <div className="lg:col-span-1">
  <Link href="/" className="flex items-center gap-3 mb-4">
    <Image
      src="/logo.png"
      alt="New York Cafe & Restaurant"
      width={90}
      height={45}
      className="object-contain hover:scale-105 transition duration-300"
      priority
    />
<div className="flex flex-col">
  <span className="font-display text-sm font-semibold text-nyc-cream dark:text-nyc-cream light:text-nyc-base">
    {lang === "am"
      ? "ኒው ዮርክ ካፌ እና ሬስቶራንት"
      : "New York Cafe & Restaurant"}
  </span>
</div>
  </Link>
  



</div>





<div className="lg:col-span-2 grid grid-cols-2 gap-2 sm:gap-8">
  
  {/* Quick Links */}
  <div>
    <h4 className="text-sm font-semibold mb-3 text-nyc-gold-light">
      {tr.quickLinks}
    </h4>

    <div className="flex flex-col gap-2 text-sm">
      <Link href="/" className="hover:text-nyc-gold">{tr.home}</Link>
      <Link href="/about" className="hover:text-nyc-gold">{tr.about}</Link>
      <Link href="/menu" className="hover:text-nyc-gold">{tr.menu}</Link>
      <Link href="/gallery" className="hover:text-nyc-gold">{tr.gallery}</Link>
      <Link href="/reviews" className="hover:text-nyc-gold">{tr.reviews}</Link>
      <Link href="/contact" className="hover:text-nyc-gold">{tr.contactLink}</Link>
    </div>
  </div>


  {/* Hours */}
  
<div className="min-w-0">
  <h4 className="text-sm font-semibold mb-3 text-nyc-gold-light">
      {tr.hours}
    </h4>

    <div className="flex flex-col gap-1 text-sm text-nyc-taupe">
      {Object.entries(hours).length > 0 ? (
        Object.entries(dayLabels).map(([key, label]) => (
       <p key={key} className="text-[11px] sm:text-sm leading-5">
            <span className="text-nyc-cream dark:text-nyc-cream light:text-nyc-base">
              {label[lang]}:
            </span>{" "}
            {hours[key]
              ? (lang === "am"
                  ? toEthiopianRange(hours[key])
                  : hours[key])
              : "—"}
          </p>
        ))
      ) : (
        <p>{tr.hoursSoon}</p>
      )}
    </div>
  </div>

</div>



<div className="w-full">
  <h4 className="text-sm font-semibold mb-3 text-nyc-gold-light">{tr.contact}</h4>
          <div className="flex flex-col gap-1 text-sm text-nyc-taupe mb-4">
            {restaurant?.address && <p>{restaurant.address}</p>}
            {restaurant?.phone && <p>{restaurant.phone}</p>}
            {restaurant?.email && <p>{restaurant.email}</p>}
          </div>

{/* Social Media */}
<div className="flex justify-center gap-3 mb-5">

  <a
    href={social.instagram || "https://instagram.com"}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full border border-nyc-gold/30 flex items-center justify-center text-nyc-gold hover:bg-nyc-gold/10 hover:scale-110 transition"
  >
    <FaInstagram size={15} />
  </a>

  <a
    href={social.tiktok || "https://tiktok.com"}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full border border-nyc-gold/30 flex items-center justify-center text-nyc-gold hover:bg-nyc-gold/10 hover:scale-110 transition"
  >
    <FaTiktok size={15} />
  </a>

  <a
    href={social.facebook || "https://facebook.com"}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full border border-nyc-gold/30 flex items-center justify-center text-nyc-gold hover:bg-nyc-gold/10 hover:scale-110 transition"
  >
    <FaFacebookF size={15} />
  </a>

  <a
    href={social.whatsapp || "https://wa.me"}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-full border border-nyc-gold/30 flex items-center justify-center text-nyc-gold hover:bg-nyc-gold/10 hover:scale-110 transition"
  >
    <FaWhatsapp size={15} />
  </a>

</div>

         <div className="flex flex-col gap-2 w-full">
            <Link href="/menu" className="text-center py-2 rounded-md bg-nyc-gold/10 border border-nyc-gold/40 text-nyc-gold-light text-sm  hover:bg-nyc-gold/25">
              {tr.viewMenu}
            </Link>
            <Link href="/order-online" className="text-center py-2 rounded-md bg-nyc-gold text-nyc-base text-sm font-medium  hover:bg-nyc-gold-light ">
              {tr.orderOnline}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-nyc-gold/10 py-4 text-center text-xs text-nyc-taupe">
        © {new Date().getFullYear()} {restaurant?.name ?? "New York Cafe & Restaurant"}. {tr.rights}
      </div>
    </footer>
  );
}
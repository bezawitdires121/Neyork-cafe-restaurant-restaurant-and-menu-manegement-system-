"use client";
import { useCartStore } from "@/lib/cart-store";
import { useLanguage } from "@/lib/language-context";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import MenuQuickActions from "@/components/MenuQuickActions";
import { useTheme } from "@/lib/theme-context";
import MenuItemReviews from "@/components/MenuItemReviews";
import {
  Sun,
  Moon,
  LayoutGrid,
  List,
  ShoppingCart,
  Bell,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Item = {
  id: string;
  nameEn: string;
  nameAm: string;
  descEn: string | null;
  descAm: string | null;
  priceETB: number;
  priceUSD: number;
  rating: number;
  ratingCount: number;
  isFeatured: boolean;
  isAvailable: boolean;
  ingredients: string | null;
  ingredientsAm: string | null;
  imageUrl: string | null;
  dietTypeId: string | null;
  additionalCategories: { id: string }[];
  category: { id: string; nameEn: string; nameAm: string };
};

type Category = { id: string; nameEn: string; nameAm: string };
type DietType = {
  id: string;
  nameEn: string;
  nameAm: string;
};
type SortOption = "az" | "priceLow" | "priceHigh" | "rating";
type Currency = "ETB" | "USD";
type ViewMode = "grid" | "list";

export default function MenuBrowser({
  items,
  categories,
  exchangeRate,
  dietTypes,
}: {
  items: Item[];
  categories: Category[];
  exchangeRate: number;
  dietTypes: DietType[];
}) {
  const addItem = useCartStore((s) => s.addItem);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const { lang, setLang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [activeDietType, setActiveDietType] = useState<string | "all">("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(false);
  const [sort, setSort] = useState<SortOption>("az");
  const [currency, setCurrency] = useState<Currency>("ETB");
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<ViewMode>("grid");
  const [sortOpen, setSortOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [expandedIngredients, setExpandedIngredients] = useState<string[]>([]);
const toggleIngredients = (id: string) => {
  setExpandedIngredients((prev) =>
    prev.includes(id)
      ? prev.filter((item) => item !== id)
      : [...prev, id]
  );
};

  const t = {
    title: lang === "en" ? "Digital Menu" : "ዲጂታል ምናሌ",
    all: lang === "en" ? "All" : "ሁሉም",
    search: lang === "en" ? "Search menu..." : "ምናሌ ይፈልጉ...",
    maxPrice: lang === "en" ? "Max price" : "ከፍተኛ ዋጋ",
    noItems: lang === "en" ? "No items found." : "ምንም አልተገኘም።",
    sortAZ: lang === "en" ? "A-Z" : "በፊደል ቅደም ተከተል",
sortLow: lang === "en" ? "Price: Low to High" : "ዋጋ: ከዝቅተኛ ወደ ከፍተኛ",
sortHigh: lang === "en" ? "Price: High to Low" : "ዋጋ: ከከፍተኛ ወደ ዝቅተኛ",
sortRating: lang === "en" ? "Highest Rated" : "በጣም የተመዘገበ",
  };

  const filtered = useMemo(() => {
    let result = items;

    if (activeCategory !== "all") {
    result = result.filter(
      (i) =>
        i.category.id === activeCategory ||
        i.additionalCategories.some((c) => c.id === activeCategory)
    );
  }

  if (activeDietType !== "all") {
    result = result.filter(
      (i) => i.dietTypeId === activeDietType
    );
  }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.nameEn.toLowerCase().includes(q) ||
          i.nameAm.toLowerCase().includes(q) ||
          i.descEn?.toLowerCase().includes(q) ||
          i.descAm?.toLowerCase().includes(q)
      );
    }

    if (maxPrice !== "" && !isNaN(Number(maxPrice))) {
      result = result.filter((i) => i.priceETB <= Number(maxPrice));
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "az":
          return a.nameEn.localeCompare(b.nameEn);
        case "priceLow":
          return a.priceETB - b.priceETB;
        case "priceHigh":
          return b.priceETB - a.priceETB;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return result;
  }, [items, activeCategory, activeDietType, search, maxPrice, sort]);

  const formatPrice = (item: Item) =>
    currency === "ETB" ? `${item.priceETB} ETB` : `$${item.priceUSD.toFixed(2)}`;

  const dark = theme === "dark";
  const bg = dark
  ? "bg-[#181614] text-nyc-cream"
  : "bg-[#F6EFE6] text-nyc-base";

const cardBg = dark
  ? "bg-[#211D19] border-nyc-gold/10"
  : "bg-[#FFF9F0] border-nyc-gold/20";

const inputBg = dark
  ? "bg-transparent border-neutral-700 text-white placeholder:text-neutral-500"
  : "bg-transparent border-nyc-gold/25 text-nyc-base placeholder:text-nyc-base/50";

const pillInactive = dark
  ? "bg-transparent border border-neutral-700 text-neutral-300"
  : "bg-transparent border border-nyc-gold/25 text-nyc-base hover:border-nyc-gold/60 hover:bg-nyc-gold/5";

const pillActive = dark
  ? "bg-white text-black"
  : "bg-nyc-gold text-nyc-base border border-nyc-gold";


  return (
<div className={`min-h-screen py-10 px-4 sm:px-6 transition-colors ${bg}`}>

  <div className="max-w-6xl mx-auto rounded-[var(--radius-panel)] border border-nyc-gold/10 bg-nyc-cream/[0.03] light:bg-nyc-base/[0.03] p-5 sm:p-8 backdrop-blur-sm text-nyc-cream light:text-nyc-base">
      
      
      
      <div className="mb-8">

  {/* Restaurant Logo + Name */}
  <div className="flex flex-col items-center mb-8">
    <Link href="/">
      <Image
        src="/logo-navbar.png"
        alt="New York Cafe & Restaurant"
        width={70}
        height={70}
        className="rounded-full object-cover hover:scale-105 transition duration-300"
        priority
      />
    </Link>

    <h2 className="mt-3 font-display text-lg font-semibold text-nyc-base dark:text-nyc-cream">
      {lang === "am"
        ? "ኒው ዮርክ ካፌ እና ሬስቶራንት"
        : "New York Cafe & Restaurant"}
    </h2>
  </div>


  <div className="flex justify-between items-center flex-wrap gap-4 mb-5">

    <h1 className="font-display text-3xl text-nyc-base dark:text-nyc-cream">
      {t.title}
    </h1>

    <div className="flex gap-2 items-center flex-wrap">

      <motion.button
        onClick={toggleTheme}
        whileTap={{ scale: 0.9 }}
        className={`p-3 rounded-full ${pillInactive}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={dark ? "sun" : "moon"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {dark ? (
              <Sun size={16} strokeWidth={1.75} />
            ) : (
              <Moon size={16} strokeWidth={1.75} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>


      <button
        onClick={() => setLang(lang === "en" ? "am" : "en")}
        className={`relative w-14 h-8 rounded-full ${pillInactive}`}
      >
        <motion.div
          className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${
            dark
              ? "bg-nyc-gold text-nyc-base"
              : "bg-nyc-gold text-nyc-base"
          }`}
          animate={{ left: lang === "en" ? 4 : 28 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {lang === "en" ? "EN" : "አማ"}
        </motion.div>
      </button>

    </div>

  </div>


  <div className="space-y-2 sm:space-y-0">
  <input
    type="text"
    placeholder={t.search}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className={`w-full sm:w-auto px-4 py-2.5 sm:py-3 rounded-full border text-sm sm:flex-1 sm:min-w-[220px] ${inputBg}`}
  />
  <div className="flex gap-2 sm:gap-3 flex-wrap items-center sm:mt-3">
    <input
      type="number"
      placeholder={t.maxPrice}
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
      className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-full border text-xs sm:text-sm w-28 sm:w-36 ${inputBg}`}
    />
  <div className="relative flex-1 sm:flex-none min-w-0">

  <button
    type="button"
    onClick={() => setSortOpen(!sortOpen)}
    className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border text-xs sm:text-sm cursor-pointer transition-all flex items-center justify-between gap-2 ${inputBg} hover:border-nyc-gold/20 hover:bg-nyc-gold/20`}
  >
    {sort === "az"
      ? t.sortAZ
      : sort === "priceLow"
      ? t.sortLow
      : sort === "priceHigh"
      ? t.sortHigh
      : t.sortRating}

    <ChevronDown
      size={15}
      className={`transition-transform ${
        sortOpen ? "rotate-180" : ""
      }`}
    />
  </button>


  {sortOpen && (
    <div className="absolute z-50 mt-2 w-full rounded-xl border border-nyc-gold/20 bg-nyc-cream/80 dark:bg-[#181614]/90 backdrop-blur-md overflow-hidden shadow-xl">

      {[
        { value: "az", label: t.sortAZ },
        { value: "priceLow", label: t.sortLow },
        { value: "priceHigh", label: t.sortHigh },
        { value: "rating", label: t.sortRating },
      ].map((option) => (
        <button
          key={option.value}
          onClick={() => {
            setSort(option.value as SortOption);
            setSortOpen(false);
          }}
          className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm transition-all
            hover:bg-nyc-gold hover:text-nyc-base
            ${
              sort === option.value
                ? "bg-nyc-gold/20 text-nyc-gold"
                : "text-nyc-base dark:text-nyc-cream"
            }
          `}
        >
          {option.label}
        </button>
      ))}

    </div>
  )}

</div>
    <button
      onClick={() => setCurrency(currency === "ETB" ? "USD" : "ETB")}
      className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium ${pillInactive}`}
    >
      {currency}
    </button>
    <motion.button
      onClick={() => setView(view === "grid" ? "list" : "grid")}
      whileTap={{ scale: 0.9 }}
      className={`p-2.5 sm:p-3 rounded-full ${pillInactive}`}
    >
      {view === "grid" ? <List size={16} strokeWidth={1.75} /> : <LayoutGrid size={16} strokeWidth={1.75} />}
    </motion.button>
  </div>
</div>

</div>




<div className="flex flex-wrap justify-center gap-3 mb-8">

  <button
    onClick={() => setActiveDietType("all")}
    className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all hover:-translate-y-1 ${
      activeDietType === "all"
        ? "bg-nyc-gold text-nyc-base border-nyc-gold shadow-lg shadow-nyc-gold/20"
        : "bg-transparent text-nyc-gold border-nyc-gold/40 hover:bg-nyc-gold/10"
    }`}
  >
    {t.all}
  </button>


  {dietTypes.map((diet) => (
    <button
      key={diet.id}
      onClick={() => setActiveDietType(diet.id)}
      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 hover:-translate-y-0.5 ${
        activeDietType === diet.id
          ? "bg-nyc-gold text-nyc-base border-nyc-gold shadow-lg shadow-nyc-gold/20"
          : "bg-transparent text-nyc-gold border-nyc-gold/40 hover:bg-nyc-gold/10"
      }`}
    >
      {lang === "en" ? diet.nameEn : diet.nameAm}
    </button>
  ))}

</div>
    <div className="flex flex-wrap justify-center gap-2 mb-6">

  {categories.map((c, index) => (
    <motion.button
      key={c.id}
      onClick={() => setActiveCategory(c.id)}
     whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
     className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
        activeCategory === c.id
          ? "bg-nyc-gold text-nyc-base border-nyc-gold shadow-lg shadow-nyc-gold/20"
          : "bg-transparent text-nyc-gold border-nyc-gold/30 hover:bg-nyc-gold/10"
      }`}
    >
      {lang === "en" ? c.nameEn : c.nameAm}
    </motion.button>
  ))}

</div>

   <div
  className={
    view === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      : "flex flex-col gap-3"
  }
>
        {filtered.map((item) => (
          <motion.div
  key={item.id}
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{
    duration: 0.5,
    ease: "easeOut",
  }}
  whileHover={{ y: -4 }}
  className={`group rounded-xl overflow-hidden border border-nyc-gold/20 ${cardBg} ${
    view === "list" ? "flex gap-4 items-center p-3" : ""
  } hover:-translate-y-1 hover:border-nyc-gold/50 hover:shadow-xl hover:shadow-nyc-gold/10 transition-all duration-300`}
>
  {item.imageUrl && (
   <div className={`relative overflow-hidden ${view === "list" ? "w-20 h-20 flex-shrink-0" : "w-full h-40"}`}>
      <Image
        src={item.imageUrl}
        alt={item.nameEn}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {item.isFeatured && (
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-nyc-gold text-nyc-base text-[10px] font-semibold tracking-wide">
          {lang === "en" ? "FEATURED" : "ተመራጭ"}
        </span>
      )}
      {!item.isAvailable && (
        <div className="absolute inset-0 bg-nyc-base/70 flex items-center justify-center">
          <span className="text-nyc-cream text-xs font-medium">
            {lang === "en" ? "Unavailable" : "አይገኝም"}
          </span>
        </div>
      )}
    </div>
  )}
<div className={view === "list" ? "flex-1" : "p-4"}>
    <p className="font-display font-medium text-base">{lang === "en" ? item.nameEn : item.nameAm}</p>
    {(lang === "en" ? item.descEn : item.descAm) && (
  <p className="text-nyc-taupe text-xs mt-1">
    {lang === "en" ? item.descEn : item.descAm}
  </p>
)}
    <p className="text-sm mt-2 text-nyc-gold-light font-medium">{formatPrice(item)}</p>
{(lang === "en" ? item.ingredients : item.ingredientsAm) && (() => {
  const ingredientsText = lang === "en" ? item.ingredients! : item.ingredientsAm!;
  const ingredientsParts = ingredientsText.split(",").map((p) => p.trim());
  const isExpanded = expandedIngredients.includes(item.id);
  const hasMore = ingredientsParts.length > 2;

  return (
    <div className="text-[11px] mt-2">
      <p className="text-nyc-taupe/80">
        <span className="font-medium text-nyc-taupe">{lang === "en" ? "Ingredients: " : "ይዘቶች: "}</span>
        {isExpanded ? ingredientsText : ingredientsParts.slice(0, 2).join(", ")}
        {hasMore && !isExpanded && "…"}
      </p>
      {hasMore && (
        <button
          onClick={() => toggleIngredients(item.id)}
          className="flex items-center gap-0.5 mt-1 text-nyc-gold hover:text-nyc-gold-light transition-colors text-[10px] font-medium"
        >
          {isExpanded ? (lang === "en" ? "Show less" : "አሳንስ") : (lang === "en" ? "Show more" : "ተጨማሪ አሳይ")}
          <ChevronDown size={12} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
})()}
    <MenuItemReviews
      itemId={item.id}
      lang={lang}
      initialRating={item.rating}
      initialCount={item.ratingCount}
    />
    <button
      onClick={() => {
        addItem({
          id: item.id,
          nameEn: item.nameEn,
          nameAm: item.nameAm,
          priceETB: item.priceETB,
          priceUSD: item.priceUSD,
          imageUrl: item.imageUrl,
        });
        setToast(true);
        setTimeout(() => setToast(false), 1500);
      }}
     className="mt-3 w-full py-2.5 rounded-full text-xs font-medium bg-nyc-gold text-nyc-base hover:bg-nyc-gold-light transition-all active:scale-95"
    >
      {lang === "en" ? "Add to Order" : "ጨምር"}
    </button>
  </div>
</motion.div>
        ))}
      </div>
</div>
      {filtered.length === 0 && <p className="text-neutral-500 mt-8 text-center">{t.noItems}</p>}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50">
          {lang === "en" ? "Added to cart" : "ወደ ጋሪ ታክሏል"}
        </div>
      )}
      <MenuQuickActions cartCount={cartCount} />
    </div>
  
  );
}
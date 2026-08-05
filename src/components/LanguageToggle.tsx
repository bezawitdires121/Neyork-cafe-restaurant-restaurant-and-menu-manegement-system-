"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setLang(lang === "en" ? "am" : "en")}
      aria-label="Toggle Language"
      className={`relative w-14 h-8 rounded-full transition-all duration-300 border overflow-hidden backdrop-blur-md ${
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-black/5 border-black/10"
      }`}
    >
      {/* Moving Circle */}
      <motion.div
        animate={{
          left: lang === "en" ? 4 : 28,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md backdrop-blur-sm ${
          isDark
            ? "bg-white/80 text-black"
            : "bg-black/70 text-white"
        }`}
      >
        {lang === "en" ? "EN" : "አማ"}
      </motion.div>

      {/* Background Labels */}
      <div
        className={`absolute inset-0 flex items-center justify-between px-2 text-[10px] font-semibold pointer-events-none ${
          isDark ? "text-white/60" : "text-black/50"
        }`}
      >
        <span className={lang === "en" ? "opacity-0" : "opacity-70"}>
          EN
        </span>

        <span className={lang === "am" ? "opacity-0" : "opacity-70"}>
          አማ
        </span>
      </div>
    </button>
  );
}
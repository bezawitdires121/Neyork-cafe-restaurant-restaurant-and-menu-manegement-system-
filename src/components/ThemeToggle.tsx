"use client";

import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-full bg-nyc-cream/10 hover:bg-nyc-cream/20 dark:bg-nyc-cream/10 light:bg-nyc-base/10 transition-colors"
    >
      {!mounted ? (
        <div className="w-4 h-4" />
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "dark" ? (
              <Sun
                size={16}
                strokeWidth={1.75}
                className="text-nyc-cream"
              />
            ) : (
              <Moon
                size={16}
                strokeWidth={1.75}
                className="text-nyc-base"
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.button>
  );
}
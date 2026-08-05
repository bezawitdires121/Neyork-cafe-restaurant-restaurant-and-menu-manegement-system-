"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  ready: boolean;
}>({ theme: "dark", toggleTheme: () => {}, ready: false });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nyc-theme");
      if (stored === "light" || stored === "dark") return stored;
    }
    return "light";
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nyc-theme") as Theme | null;
    if (stored) setTheme(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("nyc-theme", next);
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
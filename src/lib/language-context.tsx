"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "am";

const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  ready: boolean;
}>({ lang: "en", setLang: () => {}, ready: false });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined" && (window as any).__nycLang) {
      return (window as any).__nycLang as Language;
    }
    return "en";
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nyc-lang") as Language | null;
    if (stored) setLangState(stored);
    setReady(true);
  }, []);

  const setLang = (l: Language) => {
    localStorage.setItem("nyc-lang", l);
    setLangState(l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
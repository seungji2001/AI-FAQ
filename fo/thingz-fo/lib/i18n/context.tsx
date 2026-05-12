"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, Translations, getT } from "./translations";

interface LanguageContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "ko",
  t: getT("ko"),
  setLocale: () => {},
});

function readLocale(): Locale {
  if (typeof document === "undefined") return "ko";
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]+)/);
  const val = match?.[1];
  return (val === "en" || val === "ja" || val === "ko") ? val : "ko";
}

function writeLocale(locale: Locale) {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ko");

  useEffect(() => {
    setLocaleState(readLocale());
  }, []);

  const setLocale = (l: Locale) => {
    writeLocale(l);
    setLocaleState(l);
  };

  return (
    <LanguageContext.Provider value={{ locale, t: getT(locale), setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT(): Translations {
  return useContext(LanguageContext).t;
}

export function useLocale() {
  return useContext(LanguageContext);
}

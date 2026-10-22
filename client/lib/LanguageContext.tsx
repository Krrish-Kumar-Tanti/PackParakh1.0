"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/i18n";

export const LANG_MAP: Record<string, Language> = {
  "English": "en",
  "हिंदी (Hindi)": "hi",
  "বাংলা (Bengali)": "bn",
  "தமிழ் (Tamil)": "ta",
  "తెలుగు (Telugu)": "te",
};

export const REVERSE_LANG_MAP: Record<Language, string> = {
  "en": "English",
  "hi": "हिंदी (Hindi)",
  "bn": "বাংলা (Bengali)",
  "ta": "தமிழ் (Tamil)",
  "te": "తెలుగు (Telugu)",
};

export type TranslationHelper = typeof translations["en"] & ((keyPath: string) => string);

function resolvePath(dict: any, keyPath: string): string | undefined {
  if (!keyPath) return undefined;
  const parts = keyPath.split(".");
  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

function getTranslationHelper(lang: Language): TranslationHelper {
  const dict = (translations as any)[lang] || (translations as any)["en"];
  const fallback = (translations as any)["en"];
  const fn = function (keyPath: string): string {
    const val = resolvePath(dict, keyPath);
    if (val !== undefined) return val;
    const fb = resolvePath(fallback, keyPath);
    if (fb !== undefined) return fb;
    return keyPath;
  };

  return new Proxy(fn, {
    get(target, prop) {
      if (typeof prop === "symbol") return (target as any)[prop];
      if (prop in target) {
        return (target as any)[prop];
      }
      // allow t.login etc object access with fallback
      if ((dict as any)[prop] !== undefined) return (dict as any)[prop];
      return (fallback as any)[prop];
    },
  }) as TranslationHelper;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationHelper;
}

const defaultHelper = getTranslationHelper("en");

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: defaultHelper,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("app_language") as Language | null) : null;
    if (saved && (translations as any)[saved]) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_language", lang);
      document.documentElement.lang = lang;
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: getTranslationHelper(language),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}


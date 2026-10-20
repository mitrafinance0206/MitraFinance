"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { localize, type Bilingual, type Language } from "@/lib/rdk";

const LanguageContext = createContext({
  language: "en" as Language,
  setLanguage: (_: Language) => {},
  t: (text: Bilingual) => text[0],
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("rdk-language");
      if (saved === "ta") setLanguage("ta");
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const changeLanguage = (value: Language) => {
    setLanguage(value);
    try {
      localStorage.setItem("rdk-language", value);
    } catch {}
  };
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t: (text) => localize(text, language),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);

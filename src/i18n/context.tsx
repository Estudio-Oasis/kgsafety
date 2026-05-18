import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translate, type Lang } from "./dictionary";

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string) => string;
};

const Ctx = createContext<LangCtx | null>(null);

function readInitial(): Lang {
  if (typeof window === "undefined") return "es";
  const saved = window.localStorage.getItem("kg-lang");
  if (saved === "es" || saved === "en") return saved;
  return "es";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    setLangState(readInitial());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("kg-lang", l);
  };

  const toggle = () => setLang(lang === "es" ? "en" : "es");
  const t = (key: string) => translate(lang, key);

  return <Ctx.Provider value={{ lang, setLang, toggle, t }}>{children}</Ctx.Provider>;
}

export function useT() {
  const ctx = useContext(Ctx);
  if (!ctx) return { lang: "es" as Lang, setLang: () => {}, toggle: () => {}, t: (k: string) => k };
  return ctx;
}

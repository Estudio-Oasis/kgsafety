import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/theme/context";
import { useT } from "@/i18n/context";

const NAV = [
  { to: "/", labelKey: "Inicio" },
  { to: "/equipos", labelKey: "Equipos" },
  { to: "/capacitacion", labelKey: "Capacitación" },
  { to: "/ingenieria", labelKey: "Ingeniería" },
  { to: "/contratistas", labelKey: "P.N.P.C." },
  { to: "/nosotros", labelKey: "Nosotros" },
  { to: "/blog", labelKey: "Blog" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang, t } = useT();

  return (
    <nav className="border-b border-white/10 px-4 md:px-12 py-4 md:py-5 flex justify-between items-center sticky top-0 bg-anchor/90 backdrop-blur-md z-50">
      <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
        <div className="w-9 h-9 md:w-10 md:h-10 bg-signal grid place-items-center">
          <div className="w-4 h-4 md:w-5 md:h-5 border-[3px] border-anchor" />
        </div>
        <span className="font-display text-sm md:text-lg tracking-tighter uppercase">
          KG <span className="text-signal">Safety</span>
        </span>
      </Link>

      <div className="hidden xl:flex gap-7 text-xs font-bold uppercase tracking-widest text-white/60">
        {NAV.slice(1).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="hover:text-signal transition-colors"
            activeProps={{ className: "text-signal" }}
          >
            {t(item.labelKey)}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={t("Cambiar tema")}
          className="p-2 bg-brand-navy text-white border border-brand-navy hover:bg-brand-blue hover:border-brand-blue transition-colors"
        >
          {theme === "dark" ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
        </button>

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          aria-label={t("Cambiar idioma")}
          className="text-[11px] font-bold uppercase tracking-widest text-white bg-brand-blue hover:bg-brand-navy transition-colors px-3 py-1.5 border border-brand-blue hover:border-brand-navy"
        >
          {lang === "es" ? "EN" : "ES"}
        </button>

        <Link
          to="/contacto"
          className="hidden md:inline-block bg-signal text-anchor px-5 lg:px-6 py-2.5 lg:py-3 font-bold text-[11px] lg:text-xs uppercase tracking-tighter border-2 border-anchor hover:bg-white transition-all shadow-[3px_3px_0_0_var(--anchor-fixed)]"
        >
          {t("Cotizar ahora")}
        </Link>
        <button
          aria-label={t("Abrir menú")}
          className="xl:hidden text-white p-1"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-anchor border-b border-white/10 xl:hidden animate-mobile-in">
          <div className="flex flex-col p-6 gap-5 text-sm font-bold uppercase tracking-widest text-white/80">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="hover:text-signal transition-colors"
                onClick={() => setOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <Link
              to="/contacto"
              className="bg-signal text-anchor px-6 py-3 font-bold text-xs uppercase tracking-tighter text-center"
              onClick={() => setOpen(false)}
            >
              {t("Cotizar ahora")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

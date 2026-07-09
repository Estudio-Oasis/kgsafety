import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "@/theme/context";
import { useT } from "@/i18n/context";

type NavItem = { to: string; labelKey: string };

const PRIMARY: NavItem[] = [
  { to: "/servicios", labelKey: "Servicios" },
  { to: "/capacitacion", labelKey: "Capacitación" },
  { to: "/ingenieria", labelKey: "Ingeniería" },
  { to: "/equipos", labelKey: "Equipos" },
  { to: "/contratistas", labelKey: "P.N.P.C." },
  { to: "/nosotros", labelKey: "Nosotros" },
  { to: "/cumplimiento", labelKey: "Cumplimiento" },
  { to: "/facturacion", labelKey: "Facturación" },
  { to: "/faq", labelKey: "FAQ" },
  { to: "/contacto", labelKey: "Contacto" },
];

const MOBILE_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Soluciones",
    items: [
      { to: "/servicios", labelKey: "Servicios" },
      { to: "/capacitacion", labelKey: "Capacitación" },
      { to: "/ingenieria", labelKey: "Ingeniería" },
      { to: "/equipos", labelKey: "Equipos" },
      { to: "/contratistas", labelKey: "P.N.P.C." },
      { to: "/industrias", labelKey: "Industrias" },
    ],
  },
  {
    label: "Compañía",
    items: [
      { to: "/nosotros", labelKey: "Nosotros" },
      { to: "/cumplimiento", labelKey: "Cumplimiento" },
      { to: "/faq", labelKey: "FAQ" },
      { to: "/facturacion", labelKey: "Facturación" },
      { to: "/contacto", labelKey: "Contacto" },
    ],
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>("Soluciones");
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang, t } = useT();

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [moreOpen]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md kg-header border-b border-[color:var(--border)]">
      {/* Utility bar (desktop only) */}
      <div className="hidden lg:block bg-[color:var(--brand-navy)] text-white/90 border-b border-white/10">
        <div className="px-4 md:px-8 lg:px-12 py-1.5 flex justify-end items-center gap-5 text-[10px] uppercase tracking-[0.22em] font-bold">
          <span className="text-white/55 normal-case tracking-normal">
            {t("Operación 24/7 · México · LATAM · USA · CA")}
          </span>
          <Link to="/portal/login" className="hover:text-[color:var(--signal)] transition-colors">
            {t("Portal clientes")}
          </Link>
          <button
            onClick={toggleLang}
            aria-label={t("Cambiar idioma")}
            className="hover:text-[color:var(--signal)] transition-colors"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={t("Cambiar tema")}
            className="inline-flex items-center hover:text-[color:var(--signal)] transition-colors"
          >
            {theme === "dark" ? <Sun size={13} strokeWidth={2.5} /> : <Moon size={13} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Main bar */}
      <nav className="px-4 md:px-8 lg:px-12 py-4 flex justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-navy grid place-items-center">
            <div className="w-4 h-4 md:w-5 md:h-5 border-[3px] border-signal" />
          </div>
          <span className="font-display text-sm md:text-lg tracking-tighter uppercase text-[color:var(--on-surface)]">
            KG <span className="text-brand-blue">Safety</span>
          </span>
        </Link>

        {/* Primary nav (desktop) */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-3 xl:gap-5 text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.14em] xl:tracking-[0.18em] text-[color:color-mix(in_oklab,var(--on-surface)_72%,transparent)]">
          {PRIMARY.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative py-1 hover:text-[color:var(--on-surface)] transition-colors whitespace-nowrap after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-[color:var(--signal)] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              activeProps={{ className: "text-[color:var(--on-surface)] after:scale-x-100" }}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Mobile-only theme + lang */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t("Cambiar tema")}
            className="lg:hidden inline-flex items-center justify-center min-w-11 min-h-11 bg-brand-navy text-white border border-brand-navy rounded-md"
          >
            {theme === "dark" ? <Sun size={18} strokeWidth={2.5} color="#F5C500" /> : <Moon size={18} strokeWidth={2.5} color="#ffffff" />}
          </button>
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t("Cambiar idioma")}
            className="lg:hidden inline-flex items-center justify-center min-w-11 min-h-11 text-[11px] font-bold uppercase tracking-widest text-white bg-brand-blue border border-brand-blue rounded-md"
          >
            {lang === "es" ? "EN" : "ES"}
          </button>

          <Link
            to="/contacto"
            className="hidden md:inline-flex items-center bg-[color:var(--signal)] text-[color:var(--anchor-fixed)] px-4 lg:px-5 py-2.5 font-bold text-[11px] uppercase tracking-[0.14em] rounded-md whitespace-nowrap hover:-translate-y-0.5 transition-transform shadow-[2px_2px_0_0_var(--anchor-fixed)]"
          >
            {t("Solicitar diagnóstico")} →
          </Link>
          <button
            type="button"
            aria-label={open ? t("Cerrar menú") : t("Abrir menú")}
            aria-expanded={open}
            aria-controls="kg-mobile-nav"
            className="lg:hidden inline-flex items-center justify-center min-w-11 min-h-11 text-[color:var(--on-surface)] rounded-md"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="kg-mobile-nav" className="absolute top-full left-0 right-0 kg-header border-b border-[color:var(--border)] lg:hidden animate-mobile-in">
          <div className="flex flex-col p-6 gap-2 text-sm font-bold uppercase tracking-widest text-[color:color-mix(in_oklab,var(--on-surface)_85%,transparent)]">
            <Link
              to="/"
              className="hover:text-brand-blue transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              {t("Inicio")}
            </Link>
            {MOBILE_GROUPS.map((group) => {
              const expanded = openGroup === group.label;
              return (
                <div key={group.label} className="border-t border-[color:var(--border)] pt-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setOpenGroup(expanded ? null : group.label)}
                    className="w-full flex items-center justify-between py-2 hover:text-brand-blue transition-colors"
                  >
                    <span>{t(group.label)}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <div className="flex flex-col gap-3 py-3 pl-3 border-l border-[color:var(--border)] text-xs">
                      {group.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="hover:text-brand-blue transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {t(item.labelKey)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              to="/portal/login"
              className="border-t border-[color:var(--border)] pt-3 mt-1 py-2 hover:text-brand-blue transition-colors"
              onClick={() => setOpen(false)}
            >
              {t("Portal clientes")}
            </Link>
            <Link
              to="/contacto"
              className="bg-signal text-[color:var(--anchor-fixed)] px-6 py-3 font-bold text-xs uppercase tracking-tighter text-center mt-3"
              onClick={() => setOpen(false)}
            >
              {t("Solicitar diagnóstico")} →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

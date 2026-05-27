import { Link } from "@tanstack/react-router";
import { useState } from "react";
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
  { to: "/industrias", labelKey: "Industrias" },
  { to: "/nosotros", labelKey: "Nosotros" },
  { to: "/facturacion", labelKey: "Facturación" },
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
  const { theme, toggle: toggleTheme } = useTheme();
  const { lang, toggle: toggleLang, t } = useT();

  return (
    <nav className="kg-header border-b border-[color:var(--border)] px-4 md:px-8 lg:px-12 py-4 md:py-5 flex justify-between items-center sticky top-0 backdrop-blur-md z-50">
      <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
        <div className="w-9 h-9 md:w-10 md:h-10 bg-brand-navy grid place-items-center">
          <div className="w-4 h-4 md:w-5 md:h-5 border-[3px] border-signal" />
        </div>
        <span className="font-display text-sm md:text-lg tracking-tighter uppercase text-[color:var(--on-surface)]">
          KG <span className="text-brand-blue">Safety</span>
        </span>
      </Link>

      <div className="hidden xl:flex gap-5 2xl:gap-6 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)]">
        {PRIMARY.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="hover:text-brand-blue transition-colors whitespace-nowrap"
            activeProps={{ className: "text-brand-blue" }}
          >
            {t(item.labelKey)}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          onClick={toggleTheme}
          aria-label={t("Cambiar tema")}
          className="p-2 bg-brand-navy text-white border border-brand-navy hover:bg-brand-blue hover:border-brand-blue transition-colors"
        >
          {theme === "dark" ? <Sun size={16} strokeWidth={2.5} color="#F5C500" /> : <Moon size={16} strokeWidth={2.5} color="#ffffff" />}
        </button>

        <button
          onClick={toggleLang}
          aria-label={t("Cambiar idioma")}
          className="text-[11px] font-bold uppercase tracking-widest text-white bg-brand-blue hover:bg-brand-navy transition-colors px-3 py-1.5 border border-brand-blue hover:border-brand-navy"
        >
          {lang === "es" ? "EN" : "ES"}
        </button>

        <Link
          to="/contacto"
          className="hidden md:inline-block bg-signal text-[color:var(--anchor-fixed)] px-4 lg:px-5 py-2.5 font-bold text-[11px] uppercase tracking-tighter border-2 border-[color:var(--anchor-fixed)] hover:bg-white transition-all shadow-[3px_3px_0_0_var(--anchor-fixed)]"
        >
          {t("Solicitar diagnóstico")}
        </Link>
        <button
          aria-label={t("Abrir menú")}
          className="xl:hidden text-[color:var(--on-surface)] p-1"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 kg-header border-b border-[color:var(--border)] xl:hidden animate-mobile-in">
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
              to="/contacto"
              className="bg-signal text-[color:var(--anchor-fixed)] px-6 py-3 font-bold text-xs uppercase tracking-tighter text-center mt-3"
              onClick={() => setOpen(false)}
            >
              {t("Solicitar diagnóstico")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

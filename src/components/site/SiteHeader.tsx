import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Inicio" },
  { to: "/equipos", label: "Equipos" },
  { to: "/capacitacion", label: "Capacitación" },
  { to: "/ingenieria", label: "Ingeniería" },
  { to: "/contratistas", label: "P.N.P.C." },
  { to: "/nosotros", label: "Nosotros" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-white/10 px-6 md:px-12 py-5 flex justify-between items-center sticky top-0 bg-anchor/90 backdrop-blur-md z-50">
      <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
        <div className="w-10 h-10 bg-signal grid place-items-center">
          <div className="w-5 h-5 border-[3px] border-anchor" />
        </div>
        <span className="font-display text-base md:text-lg tracking-tighter uppercase">
          KG <span className="text-signal">Safety</span>
        </span>
      </Link>

      <div className="hidden lg:flex gap-8 text-xs font-bold uppercase tracking-widest text-white/60">
        {NAV.slice(1).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="hover:text-signal transition-colors"
            activeProps={{ className: "text-signal" }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/contacto"
          className="hidden md:inline-block bg-signal text-anchor px-6 py-3 font-bold text-xs uppercase tracking-tighter hover:bg-white transition-all"
        >
          Cotizar ahora
        </Link>
        <button
          aria-label="Abrir menú"
          className="lg:hidden text-white p-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-anchor border-b border-white/10 lg:hidden">
          <div className="flex flex-col p-6 gap-5 text-sm font-bold uppercase tracking-widest text-white/80">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="hover:text-signal transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contacto"
              className="bg-signal text-anchor px-6 py-3 font-bold text-xs uppercase tracking-tighter text-center"
              onClick={() => setOpen(false)}
            >
              Cotizar ahora
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

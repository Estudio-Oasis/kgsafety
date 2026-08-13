import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, Lock, ShieldCheck } from "lucide-react";


const CITIES = [
  { code: "MEX", labelEs: "CDMX", labelEn: "MEX", tz: "America/Mexico_City" },
  { code: "RIO", labelEs: "RIO", labelEn: "RIO", tz: "America/Sao_Paulo" },
  { code: "YTO", labelEs: "TOR", labelEn: "TOR", tz: "America/Toronto" },
  { code: "NYC", labelEs: "NYC", labelEn: "NYC", tz: "America/New_York" },
  { code: "LAX", labelEs: "LAX", labelEn: "LAX", tz: "America/Los_Angeles" },
  { code: "LON", labelEs: "LON", labelEn: "LDN", tz: "Europe/London" },
  { code: "DXB", labelEs: "DXB", labelEn: "DXB", tz: "Asia/Dubai" },
  { code: "HKG", labelEs: "HKG", labelEn: "HKG", tz: "Asia/Hong_Kong" },
  { code: "SYD", labelEs: "SYD", labelEn: "SYD", tz: "Australia/Sydney" },
];

function formatTime(tz: string, now: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
}

export function WorldClockBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const items = CITIES.map((c) => ({
    code: c.code,
    label: c.labelEs,
    time: now ? formatTime(c.tz, now) : "--:--",
  }));

  return (
    <div className="w-full bg-anchor border-b border-white/10 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/55">
      {/* Desktop xl: portal access + all cities */}
      <div className="hidden xl:flex items-center justify-between gap-6 px-12 py-1.5">
        <PortalAccess />
        <div className="flex items-center gap-6">
          {items.map((it) => (
            <div key={it.code} className="flex items-center gap-2 shrink-0">
              <span className="text-white/40">{it.code}</span>
              <span className="text-signal tabular-nums">{it.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet (md–lg): portal access fixed, cities scrollable */}
      <div className="hidden md:flex xl:hidden items-center gap-4 px-6 py-1.5">
        <PortalAccess />
        <div
          className="flex overflow-x-auto items-center gap-6 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Horas mundiales"
        >
          {items.map((it) => (
            <div key={it.code} className="flex items-center gap-2 shrink-0">
              <span className="text-white/40">{it.code}</span>
              <span className="text-signal tabular-nums">{it.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile (<md): portal access row + marquee */}
      <div className="md:hidden">
        <div className="flex items-center justify-center gap-3 px-4 pt-1.5">
          <PortalAccess compact />
        </div>
        <div className="relative py-1.5 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap animate-marquee will-change-transform">
            {[...items, ...items].map((it, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <span className="text-white/40">{it.code}</span>
                <span className="text-signal tabular-nums">{it.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalAccess({ compact = false }: { compact?: boolean }) {
  return (
    <nav aria-label="Acceso al portal" className="flex items-center gap-2 shrink-0">
      {!compact && (
        <span className="flex items-center gap-1.5 text-white/40">
          <Lock className="h-3 w-3" aria-hidden="true" />
          Portal
        </span>
      )}
      <Link
        to="/portal/login"
        className="flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-0.5 text-white/70 transition hover:border-signal/60 hover:text-signal"
      >
        <Building2 className="h-3 w-3" aria-hidden="true" />
        Clientes
      </Link>
      <Link
        to="/portal/login"
        className="flex items-center gap-1.5 rounded-full border border-signal/40 px-2.5 py-0.5 text-signal transition hover:bg-signal/10"
      >
        <ShieldCheck className="h-3 w-3" aria-hidden="true" />
        Acceso KG
      </Link>
    </nav>
  );
}


import { useEffect, useState } from "react";

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
    <div className="w-full bg-anchor border-b border-white/10 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/55 overflow-hidden">
      {/* Desktop xl: static row, all cities visible */}
      <div className="hidden xl:flex justify-end items-center gap-6 px-12 py-1.5">
        {items.map((it) => (
          <div key={it.code} className="flex items-center gap-2 shrink-0">
            <span className="text-white/40">{it.code}</span>
            <span className="text-signal tabular-nums">{it.time}</span>
          </div>
        ))}
      </div>

      {/* Tablet + Mobile (<xl): marquee */}
      <div className="xl:hidden relative py-1.5">
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
  );
}

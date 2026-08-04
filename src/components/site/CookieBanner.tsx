import { useEffect, useState } from "react";
import { useT } from "@/i18n/context";

const CONSENT_KEY = "kg_cookie_consent";

export function CookieBanner() {
  const { t } = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = window.localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  function decide(value: "accepted" | "rejected") {
    window.localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50 bg-[color:var(--anchor-fixed)] border-t border-white/10 px-4 py-4 md:px-6 md:py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <p className="text-sm text-white/80 leading-relaxed flex-1">
          {t("Utilizamos cookies estrictamente necesarias para el funcionamiento del sitio. Puede aceptar o rechazar las cookies opcionales de analítica. Consulte nuestra")}{" "}
          <a href="/aviso-de-privacidad" className="text-signal hover:underline">
            {t("política de privacidad")}
          </a>.
        </p>
        <div className="flex w-full md:w-auto shrink-0 flex-col sm:flex-row gap-2">
          <button
            onClick={() => decide("rejected")}
            className="min-h-11 border border-white/25 text-white px-5 py-3 font-bold uppercase text-xs tracking-widest hover:border-signal hover:text-signal transition-colors"
          >
            {t("Rechazar opcionales")}
          </button>
          <button
            onClick={() => decide("accepted")}
            className="min-h-11 bg-signal text-[color:var(--anchor-fixed)] px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors"
          >
            {t("Aceptar todas")}
          </button>
        </div>
      </div>
    </div>
  );
}


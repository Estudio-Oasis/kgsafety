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

  function accept() {
    window.localStorage.setItem(CONSENT_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[color:var(--anchor-fixed)] border-t border-white/10 px-4 py-4 md:px-6 md:py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
        <p className="text-sm text-white/80 leading-relaxed flex-1">
          {t("Utilizamos cookies para mejorar su experiencia y analizar el tráfico del sitio. Al continuar navegando, acepta nuestra")}{" "}
          <a href="/aviso-de-privacidad" className="text-signal hover:underline">
            {t("política de privacidad")}
          </a>.
        </p>
        <button
          onClick={accept}
          className="shrink-0 bg-signal text-[color:var(--anchor-fixed)] px-6 py-3 font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors"
        >
          {t("Aceptar")}
        </button>
      </div>
    </div>
  );
}

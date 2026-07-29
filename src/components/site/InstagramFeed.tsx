import { useEffect, useRef, useState } from "react";
import { Instagram } from "lucide-react";
import { useT } from "@/i18n/context";
import { SectionLabel } from "@/components/site/SectionLabel";

const POSTS = [
  "https://www.instagram.com/p/DaTajPdxQkd/",
  "https://www.instagram.com/p/DaLbArmR_cv/",
  "https://www.instagram.com/p/DZdOzE3xYid/",
];

const HANDLE = "kg_safety";
const PROFILE_URL = `https://instagram.com/${HANDLE}`;
const SCRIPT_SRC = "https://www.instagram.com/embed.js";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function loadInstagramScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if (window.instgrm) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

export function InstagramFeed() {
  const { t } = useT();
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !rootRef.current) return;
    const node = rootRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    loadInstagramScript().then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => window.instgrm?.Embeds.process());
    });
    return () => {
      cancelled = true;
    };
  }, [visible]);

  return (
    <section className="px-4 md:px-8 lg:px-12 py-16 md:py-24 bg-[color:var(--surface-2)] border-y border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel>{t("Instagram")}</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">
              {t("Síguenos en Instagram")}
            </h2>
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-brand-blue font-bold text-[11px] uppercase tracking-[0.22em] hover:text-signal transition-colors"
            >
              <Instagram size={14} strokeWidth={2.5} />@{HANDLE}
            </a>
          </div>
        </div>

        <div ref={rootRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((url) => (
            <div key={url} className="min-w-0 flex justify-center">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  borderRadius: 3,
                  boxShadow:
                    "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                  margin: 0,
                  maxWidth: 540,
                  minWidth: 260,
                  padding: 0,
                  width: "100%",
                }}
              >
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {t("Ver publicación en Instagram")}
                </a>
              </blockquote>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-signal text-anchor px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,0.35)]"
          >
            <Instagram size={16} strokeWidth={2.5} />
            {t("Ver más en Instagram")} →
          </a>
        </div>
      </div>
    </section>
  );
}

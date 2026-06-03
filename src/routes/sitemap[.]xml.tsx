import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { COURSES, EQUIPMENT, ENGINEERING, SERVICE_DETAILS } from "@/data/kaee";

const BASE_URL = "https://kgsafety.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/servicios", changefreq: "monthly", priority: "0.9" },
          { path: "/capacitacion", changefreq: "monthly", priority: "0.9" },
          { path: "/ingenieria", changefreq: "monthly", priority: "0.9" },
          { path: "/equipos", changefreq: "monthly", priority: "0.9" },
          { path: "/industrias", changefreq: "monthly", priority: "0.8" },
          { path: "/contratistas", changefreq: "monthly", priority: "0.8" },
          { path: "/cumplimiento", changefreq: "monthly", priority: "0.8" },
          { path: "/soluciones", changefreq: "monthly", priority: "0.7" },
          { path: "/nosotros", changefreq: "yearly", priority: "0.6" },
          { path: "/faq", changefreq: "monthly", priority: "0.6" },
          { path: "/contacto", changefreq: "yearly", priority: "0.7" },
          { path: "/facturacion", changefreq: "yearly", priority: "0.4" },
          { path: "/blog", changefreq: "weekly", priority: "0.5" },
        ];

        const dynamicPaths: SitemapEntry[] = [
          ...COURSES.map((c) => ({ path: `/capacitacion/${c.slug}`, changefreq: "monthly" as const, priority: "0.7" })),
          ...EQUIPMENT.map((e) => ({ path: `/equipos/${e.slug}`, changefreq: "monthly" as const, priority: "0.7" })),
          ...ENGINEERING.map((e) => ({ path: `/ingenieria/${e.slug}`, changefreq: "monthly" as const, priority: "0.7" })),
          ...SERVICE_DETAILS.map((s) => ({ path: `/servicios/${s.slug}`, changefreq: "monthly" as const, priority: "0.7" })),
        ];

        const entries = [...staticPaths, ...dynamicPaths];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});

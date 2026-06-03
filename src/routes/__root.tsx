import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site/SiteHeader";
import { WorldClockBar } from "@/components/site/WorldClockBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { ScrollRappellers } from "@/components/site/ScrollRappellers";
import { ThemeProvider } from "@/theme/context";
import { LanguageProvider, useT } from "@/i18n/context";

function NotFoundComponent() {
  const { t } = useT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-anchor px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-signal">404</h1>
        <h2 className="mt-4 text-xl font-bold uppercase tracking-widest text-white">
          {t("Página no encontrada")}
        </h2>
        <p className="mt-3 text-sm text-white/60">{t("La página que buscas no existe o fue movida.")}</p>
        <Link
          to="/"
          className="mt-8 inline-block bg-signal text-anchor px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
        >
          {t("Volver al inicio")}
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-anchor px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl uppercase tracking-widest text-white">
          {t("Algo falló")}
        </h1>
        <p className="mt-3 text-sm text-white/60">{t("Intenta recargar la página.")}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-8 bg-signal text-anchor px-8 py-4 font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
        >
          {t("Reintentar")}
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "KG Safety · Ingeniería en protección contra caídas" },
      {
        name: "description",
        content:
          "Capacitación DC-3, equipos certificados y diseño de líneas de vida para empresas Clase Mundial. 30M+ horas-hombre supervisadas sin accidentes.",
      },
      { name: "author", content: "KG Fall Protection Engineering" },
      { property: "og:site_name", content: "KG Safety" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "KG Safety · Ingeniería en protección contra caídas" },
      {
        property: "og:description",
        content:
          "Soluciones integrales en seguridad para trabajos en altura. Ingeniería, capacitación y equipos certificados.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0A0A0A" },
      { name: "twitter:title", content: "KG Safety · Ingeniería en protección contra caídas" },
      { name: "twitter:description", content: "Soluciones integrales en seguridad para trabajos en altura. Ingeniería, capacitación y equipos certificados." },

    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Michroma&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "KG Fall Protection Engineering",
          alternateName: "KG Safety",
          url: "https://kgsafety.lovable.app",
          slogan: "We never fall.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "José María Pino Suárez 304-1, Col. 5 de Mayo",
            addressLocality: "Toluca",
            addressRegion: "Estado de México",
            postalCode: "50090",
            addressCountry: "MX",
          },
          telephone: "+52-722-879-5076",
          sameAs: ["https://instagram.com/kg_safety"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  // Default class "dark"; ThemeProvider may flip to "light" on mount.
  return (
    <html lang="es" className="light">
      <head>
        <HeadContent />
      </head>
      <body className="bg-anchor text-white font-body">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPortal = pathname.startsWith("/portal");

  if (isPortal) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <Outlet />
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col bg-anchor">
            <WorldClockBar />
            <SiteHeader />
            <main className="flex-1">
              <Outlet />
            </main>
            <SiteFooter />
            <WhatsAppFloat />
            <ScrollRappellers />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

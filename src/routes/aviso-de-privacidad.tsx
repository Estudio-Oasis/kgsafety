import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";

export const Route = createFileRoute("/aviso-de-privacidad")({
  component: AvisoPrivacidadPage,
  head: () => ({
    meta: [
      { title: "Aviso de Privacidad · KG Safety" },
      { name: "description", content: "Aviso de privacidad de KG Safety. Conozca cómo tratamos sus datos personales para cotización, capacitación y servicios." },
      { property: "og:title", content: "Aviso de Privacidad · KG Safety" },
      { property: "og:description", content: "Aviso de privacidad de KG Safety." },
      { property: "og:url", content: "https://kgsafety.lovable.app/aviso-de-privacidad" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Aviso de Privacidad · KG Safety" },
    ],
    links: [{ rel: "canonical", href: "https://kgsafety.lovable.app/aviso-de-privacidad" }],
  }),
});

const SECTIONS = [
  {
    title: "Responsable del tratamiento",
    body: "KG Fall Protection Engineering S.A. de C.V., con domicilio en José María Pino Suárez 304-1, Col. 5 de Mayo, Toluca, Estado de México, C.P. 50090, es responsable del tratamiento de sus datos personales.",
  },
  {
    title: "Datos que recabamos",
    body: "Para fines de cotización, contratación, capacitación y facturación podemos recabar: nombre, cargo, empresa, correo electrónico, teléfono, RFC, domicilio fiscal y datos de contacto de los participantes en cursos.",
  },
  {
    title: "Finalidades del tratamiento",
    body: "Sus datos se utilizan para: (i) elaborar cotizaciones y propuestas técnicas; (ii) registrar participantes en cursos y emitir constancias DC-3; (iii) facturación y cumplimiento fiscal; (iv) contacto comercial y operativo; y (v) envío de información técnica relevante a su industria.",
  },
  {
    title: "Transferencias de datos",
    body: "No vendemos ni compartimos sus datos con terceros ajenos a la prestación del servicio. Solo transferimos información a proveedores de servicios tecnológicos, plataformas de pago o autoridades cuando la ley lo requiera.",
  },
  {
    title: "Derechos ARCO",
    body: "Usted tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales (derechos ARCO). Para ejercerlos, envíe un correo a capacitacion@kg-safety.com con el asunto 'Derechos ARCO'.",
  },
  {
    title: "Cambios al aviso",
    body: "KG Safety podrá actualizar este aviso de privacidad para reflejar cambios en nuestras prácticas o en la normatividad aplicable. La versión vigente estará siempre disponible en esta página.",
  },
];

function AvisoPrivacidadPage() {
  const { t } = useT();
  return (
    <div className="bg-[color:var(--surface)] text-[color:var(--on-surface)]">
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-[color:var(--border)]">
        <div className="max-w-4xl mx-auto">
          <SectionLabel>{t("Legal")}</SectionLabel>
          <h1 className="font-display text-3xl md:text-5xl uppercase leading-tight mb-6">
            {t("Aviso de")} <span className="text-signal">{t("Privacidad")}</span>
          </h1>
          <p className="text-base md:text-lg text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] leading-relaxed mb-10">
            {t("Última actualización: julio 2026. En KG Safety tratamos sus datos personales con responsabilidad, seguridad y cumplimiento normativo.")}
          </p>

          <div className="space-y-8">
            {SECTIONS.map((s, i) => (
              <article key={i} className="kg-bento p-6 md:p-8">
                <h2 className="font-display text-lg uppercase tracking-tight mb-3">{s.title}</h2>
                <p className="text-sm md:text-base text-[color:color-mix(in_oklab,var(--on-surface)_75%,transparent)] leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[color:var(--surface-2)] border border-[color:var(--border)]">
            <h3 className="font-display text-sm uppercase tracking-wider mb-2">{t("Contacto de privacidad")}</h3>
            <p className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] leading-relaxed mb-4">
              {t("Para dudas sobre este aviso o para ejercer sus derechos ARCO, escríbanos a:")}
            </p>
            <a href="mailto:capacitacion@kg-safety.com" className="text-brand-blue font-bold text-sm hover:underline">
              capacitacion@kg-safety.com
            </a>
          </div>

          <div className="mt-8">
            <Link to="/" className="text-brand-blue font-bold text-xs uppercase tracking-widest hover:underline">
              ← {t("Volver al inicio")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

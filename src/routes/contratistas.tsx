import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";

export const Route = createFileRoute("/contratistas")({
  component: ContratistasPage,
  head: () => ({
    meta: [
      { title: "P.N.P.C. · Profesionalización de Contratistas · KG Safety" },
      {
        name: "description",
        content:
          "Programa Nacional de Profesionalización a Contratistas. Estandarice la seguridad de sus proveedores externos con base de datos nacional.",
      },
      { property: "og:title", content: "P.N.P.C. · KG Safety" },
      {
        property: "og:description",
        content:
          "Control, capacitación y registro nacional de contratistas en seguridad industrial.",
      },
      { property: "og:url", content: "/contratistas" },
    ],
    links: [{ rel: "canonical", href: "/contratistas" }],
  }),
});

const BENEFITS = [
  "Control y registro de contratistas en tres niveles de capacitación.",
  "Reglas de operación claras dentro de cada planta.",
  "Acceso a base de datos nacional de contratistas inscritos.",
  "Renta de sistemas de anclaje especializados para trabajos de baja frecuencia.",
  "Reducción de tiempos muertos previo a AST y EPP.",
  "Auditoría completa por STPS, REPSE y clientes.",
];

const PROBLEMS = [
  "Mercado negro de supervisores.",
  "Falta de temarios de capacitación homologados.",
  "Retrasos por falta de profesionalismo del contratista.",
  "Criterios divididos para toma de decisiones.",
  "Desconocimiento de nuevos equipos y marcas.",
  "Planeación tardía vs procedimientos de la empresa.",
];

function ContratistasPage() {
  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl">
          <SectionLabel>P.N.P.C.</SectionLabel>
          <h1 className="font-display text-4xl md:text-6xl mb-6 uppercase leading-tight">
            Programa Nacional de<br />
            <span className="text-signal">Profesionalización</span><br />
            a Contratistas.
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
            10 años de implementación ininterrumpida en empresas multinacionales. Reducción
            a cero de accidentes en trabajos en altura bajo programa completo.
          </p>
          <Link
            to="/contacto"
            className="inline-block bg-signal text-anchor px-10 py-5 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors"
          >
            Solicitar auditoría P.N.P.C.
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <SectionLabel>Beneficios</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
              Operación bajo<br />control total.
            </h2>
            <p className="text-white/60 leading-relaxed mb-8">
              El P.N.P.C. permite controlar a los contratistas en los tres niveles de
              capacitación y al personal interno para una comunicación correcta entre
              ambas partes.
            </p>
            <div className="border-l-2 border-signal pl-6 py-4">
              <div className="font-display text-3xl md:text-4xl text-white mb-2">100%</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 leading-relaxed">
                Auditable por STPS,<br />REPSE y clientes
              </div>
            </div>
          </div>

          <ul className="space-y-5">
            {BENEFITS.map((b, i) => (
              <li key={b} className="flex gap-5 border-b border-white/10 pb-5">
                <span className="font-display text-signal text-xs shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-white/70 text-sm leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Problems we solve */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5 bg-steel">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <SectionLabel>Problemáticas que resolvemos</SectionLabel>
            <h2 className="font-display text-3xl md:text-5xl uppercase leading-tight">
              Causas raíz que <span className="text-signal">eliminamos</span>.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {PROBLEMS.map((p, i) => (
              <div key={p} className="bg-anchor p-7">
                <div className="font-display text-signal text-xs mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instituto */}
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <SectionLabel>Instituto</SectionLabel>
          <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
            Instituto Nacional de Capacitación en Seguridad Laboral KG
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Información clara, accesible y en tiempo real para todos los involucrados:
            seguridad, mantenimiento, abastecimiento, servicio médico y contratistas
            alineados bajo un solo estándar.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 md:px-12 bg-signal text-anchor text-center">
        <h2 className="font-display text-3xl md:text-5xl mb-6 uppercase leading-tight">
          Active el P.N.P.C. en su planta.
        </h2>
        <p className="text-base md:text-lg font-bold mb-10 opacity-80 uppercase tracking-tight max-w-2xl mx-auto">
          Solicite una auditoría inicial sin compromiso.
        </p>
        <Link
          to="/contacto"
          className="inline-block bg-anchor text-white px-10 md:px-12 py-5 md:py-6 font-display text-xs md:text-sm tracking-widest hover:bg-steel transition-colors uppercase"
        >
          Solicitar auditoría
        </Link>
      </section>
    </div>
  );
}

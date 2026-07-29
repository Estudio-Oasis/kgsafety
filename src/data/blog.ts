export type BlogPost = {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  content: { heading: string; body: string }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "nom-009-stps-2011-auditoria-trabajos-en-altura",
    tag: "NOM-009-STPS",
    title: "NOM-009-STPS-2011: claves para auditar trabajos en altura",
    excerpt:
      "Qué piden los auditores STPS, qué documentos debe tener su contratista y cómo demostrar competencias antes de iniciar trabajos.",
    date: "2025-04-12",
    content: [
      {
        heading: "Ámbito de aplicación",
        body: "La NOM-009-STPS-2011 aplica a todos los centros de trabajo donde se realicen actividades a 1.80 m o más sobre el nivel de referencia, o en cualquier altura cuando existan riesgos por desniveles, superficies inclinadas o bordes expuestos.",
      },
      {
        heading: "Documentos que el auditor solicita",
        body: "El patrón o contratista debe presentar: programa de seguridad específico, dictamen de líneas de vida y anclajes, constancias DC-3 vigentes, bitácoras de inspección de equipos, análisis de riesgo por trabajo y plan de rescate.",
      },
      {
        heading: "Competencias del personal",
        body: "Cada trabajador expuesto debe contar con constancia de competencia o de capacitación expedida por un agente capacitador autorizado. La recertificación anual es obligatoria.",
      },
      {
        heading: "Cómo se demuestra cumplimiento",
        body: "Mantenga expedientes digitales por persona, por equipo y por ubicación. KG Safety emite documentación auditada lista para entregar a la autoridad o al auditor interno.",
      },
    ],
  },
  {
    slug: "lvv-vs-lvh-cable-rigid-rail",
    tag: "Ingeniería",
    title: "LVV vs LVH: cuándo conviene cable y cuándo rigid rail",
    excerpt:
      "Comparativa de líneas de vida verticales y horizontales por tipo de aplicación, frecuencia de uso y factor de carga.",
    date: "2025-03-20",
    content: [
      {
        heading: "Líneas de vida verticales (LVV)",
        body: "Ideales para torres, silos, chimeneas y escaleras fijas. El cable de acero inoxidable ofrece recorrido continuo y bajo mantenimiento, mientras que el rail rígido reduce la flecha y la caída libre en alturas críticas.",
      },
      {
        heading: "Líneas de vida horizontales (LVH)",
        body: "Se instalan en azoteas, naves industriales y plataformas. Permiten desplazamiento lateral con dos puntos de anclaje simultáneos. Su diseño requiere cálculo de flecha y carga en los soportes.",
      },
      {
        heading: "Cable vs rigid rail",
        body: "El cable es económico, flexible y adecuado para recorridos largos. El rigid rail minimiza la distancia de caída, es más fácil de inspeccionar y se prefiere en acceso frecuente.",
      },
      {
        heading: "Recomendación final",
        body: "Elija la tecnología según la norma aplicable (ANSI Z359, EN-795 o CSA Z259), la frecuencia de uso y el presupuesto de mantenimiento. KG Safety diseña ambas con prueba de carga incluida.",
      },
    ],
  },
  {
    slug: "recertificacion-anual-dc3",
    tag: "Capacitación",
    title: "Recertificación anual: por qué no es opcional",
    excerpt:
      "Riesgo legal y operativo de operar con DC-3 vencidos. Cómo organizar un programa de recertificación rotativo sin paralizar planta.",
    date: "2025-02-08",
    content: [
      {
        heading: "Riesgo legal",
        body: "Operar con trabajadores cuya capacitación DC-3 está vencida expone al patrón a sanciones por incumplimiento de la NOM-009-STPS-2011 y a responsabilidad civil en caso de accidente.",
      },
      {
        heading: "Riesgo operativo",
        body: "Las destrezas decaen con el tiempo. La recertificación anual mantiene vigentes los protocolos de inspección de arnés, uso de conectores y rescate básico.",
      },
      {
        heading: "Programa rotativo",
        body: "Divida al personal en cohortes trimestrales. Así mantiene la planta operando mientras renueva constancias. KG Safety programa calendarios de recertificación a la medida.",
      },
      {
        heading: "Control digital",
        body: "Use un dashboard de vigencias para recibir alertas 60 días antes del vencimiento. Nuestro portal B2B incluye este control por trabajador y por contratista.",
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

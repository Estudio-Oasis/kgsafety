// KAEE Group FPCS — site data extracted from kaeegroupfpcs.com reference package.
// All copy preserved literally where possible.

export type CourseLevel = {
  code: "A" | "M" | "C";
  name: string;
  hours: string;
  desc: string;
};

export type Course = {
  slug: string;
  name: string;
  short: string;
  desc: string;
  levels: CourseLevel[];
};

const STANDARD_LEVELS = (area: string): CourseLevel[] => [
  { code: "A", name: "Básico / Autorizado", hours: "8 h",  desc: `Persona autorizada para ejecutar tareas de ${area} con uso correcto del EPP y procedimientos seguros.` },
  { code: "M", name: "Supervisor / Monitor", hours: "16 h", desc: `Monitor capaz de supervisar cuadrillas y verificar condiciones de seguridad durante trabajos de ${area}.` },
  { code: "C", name: "Jefe de Seguridad / Competente", hours: "24 h", desc: `Persona competente con criterio para identificar riesgos, planear maniobras y emitir permisos de ${area}.` },
];

export const COURSES: Course[] = [
  { slug: "alturas",       name: "Trabajos en Alturas",   short: "Alturas",
    desc: "Programa para trabajo en altura > 1.8 m bajo NOM-009-STPS, ANSI Z359 y OSHA 1926.",
    levels: STANDARD_LEVELS("alturas") },
  { slug: "confinados",    name: "Espacios Confinados",   short: "E. Confinados",
    desc: "Ingreso, permisos, monitoreo atmosférico y rescate en espacios confinados bajo NOM-033-STPS.",
    levels: STANDARD_LEVELS("espacios confinados") },
  { slug: "andamios",      name: "Andamios",              short: "Andamios",
    desc: "Armado, inspección y operación segura de andamios multidireccionales y de seguridad.",
    levels: STANDARD_LEVELS("andamios") },
  { slug: "loto",          name: "LOTO (Lock-Out/Tag-Out)", short: "LOTO",
    desc: "Bloqueo y etiquetado de energías peligrosas según NOM-004-STPS / OSHA 1910.147.",
    levels: STANDARD_LEVELS("LOTO") },
  { slug: "electricidad",  name: "Electricidad",          short: "Electricidad",
    desc: "Trabajos eléctricos seguros, NFPA 70E y aterrizajes temporales.",
    levels: STANDARD_LEVELS("electricidad") },
  { slug: "calor",         name: "Trabajos con Calor",    short: "Calor",
    desc: "Hot work, permisos, vigilantes contra incendio y control de chispa.",
    levels: STANDARD_LEVELS("trabajos con calor") },
  { slug: "herramientas",  name: "Manejo de Herramientas", short: "Herramientas",
    desc: "Uso, inspección y mantenimiento seguro de herramientas manuales y eléctricas.",
    levels: STANDARD_LEVELS("manejo de herramientas") },
  { slug: "primeros-auxilios", name: "Primeros Auxilios", short: "Primeros Auxilios",
    desc: "Atención inicial de emergencias médicas en sitio: RCP, hemorragias, trauma y manejo de víctima.",
    levels: STANDARD_LEVELS("primeros auxilios") },
  { slug: "extintores",    name: "Manejo de Extintores",  short: "Extintores",
    desc: "Prevención, brigadas y combate con extintor portátil bajo NOM-002-STPS.",
    levels: STANDARD_LEVELS("manejo de extintores") },
  { slug: "montacargas",   name: "Montacargas",           short: "Montacargas",
    desc: "Operación segura, inspección y maniobras certificadas de montacargas.",
    levels: STANDARD_LEVELS("montacargas") },
  { slug: "osha-10",       name: "OSHA 10 horas",         short: "OSHA 10 h",
    desc: "Programa oficial OSHA Outreach de 10 horas para personal operativo en construcción e industria general.",
    levels: [
      { code: "A", name: "OSHA 10", hours: "10 h", desc: "Programa Outreach OSHA de 10 horas con tarjeta oficial DOL." },
    ] },
  { slug: "osha-30",       name: "OSHA 30 horas",         short: "OSHA 30 h",
    desc: "Programa oficial OSHA Outreach de 30 horas para supervisores y mandos medios en construcción e industria general.",
    levels: [
      { code: "C", name: "OSHA 30", hours: "30 h", desc: "Programa Outreach OSHA de 30 horas con tarjeta oficial DOL para supervisores." },
    ] },
];

export type EquipmentCategory = {
  slug: string;
  name: string;
  desc: string;
  items: string[];
};

export const EQUIPMENT: EquipmentCategory[] = [
  { slug: "epp", name: "EPP — Equipo de Protección Personal",
    desc: "Arnés, cascos, lentes, calzado y protección de cara, oídos y nuca.",
    items: ["Arnés", "Cascos", "Lentes", "Protección para oídos", "Protección para cara", "Protección para nuca", "Coderas", "Guantes", "Peto", "Chaquetón", "Pechera", "Rodillera", "Polainas", "Calzado"] },
  { slug: "conexion", name: "Componentes de Conexión",
    desc: "Cables, retráctiles, mosquetones y conectores certificados.",
    items: ["Cable con amortiguador", "Cable con amortiguador doble pernera", "Retráctil", "Sin amortiguador", "Conector de anclaje", "Mosquetón"] },
  { slug: "anclajes", name: "Anclajes",
    desc: "Anillos D, Push-Lock, postes y platos para metal, concreto y madera.",
    items: ["Anillo D", "Push Lock", "Postes", "Platos", "Anclajes para metal", "Anclajes para concreto", "Anclajes para madera"] },
  { slug: "lineas-de-vida", name: "Líneas de Vida",
    desc: "Sistemas temporales y permanentes: horizontales, verticales, inclinadas, Over Head, Roof Top y Man Safe.",
    items: ["Temporales", "Horizontales Over Head", "Roof Top", "Man Safe", "Verticales", "Inclinadas", "Montadas sobre pared", "Cable / Riel / Cinta"] },
  { slug: "barandales", name: "Barandales (Hand Rails)",
    desc: "Fijos y removibles para concreto, lámina, pesas, rolado y engargolado.",
    items: ["Fijo concreto", "Fijo pesas", "Fijo lámina", "Fijo rolado", "Fijo engargolado", "Removible concreto", "Removible pesas", "Removible lámina"] },
  { slug: "domos", name: "Protector de Domos",
    desc: "Fijos y removibles, traslúcidos, rejilla y estructurales.",
    items: ["Domo fijo", "Domo removible", "Traslúcidas", "Rejilla", "Estructurales"] },
  { slug: "andamios", name: "Andamios",
    desc: "Multidireccionales y de seguridad para acceso y obra.",
    items: ["Multidireccionales", "De seguridad", "Fabricados a medida"] },
  { slug: "plataformas", name: "Plataformas",
    desc: "Fijas (construidas, prefabricadas, fabricadas) y móviles (manlift).",
    items: ["Fijas construidas", "Prefabricadas", "Fabricadas", "Móviles", "Manlift"] },
  { slug: "pasos", name: "Pasos de Gato",
    desc: "Pasos de gato metálicos y sintéticos para acceso vertical seguro.",
    items: ["Metálicos", "Sintéticos"] },
  { slug: "escalas", name: "Escalas",
    desc: "Escalas marinas y verticales con sistemas de protección integrados.",
    items: ["Escalas verticales", "Escalas marinas", "Con guarda hombre"] },
];

export type EngineeringService = {
  slug: string;
  name: string;
  desc: string;
  bullets: string[];
};

export const ENGINEERING: EngineeringService[] = [
  { slug: "asesoria", name: "Asesoría",
    desc: "Asesoría técnica especializada en protección contra caídas e ingeniería de seguridad industrial.",
    bullets: ["Diagnóstico inicial", "Análisis de riesgo", "Recomendaciones normativas", "Reporte ejecutivo"] },
  { slug: "consultoria", name: "Consultoría",
    desc: "Consultoría con visita en sitio para definir la solución técnica adecuada a cada estructura.",
    bullets: ["Visita en sitio", "Mediciones y levantamientos", "Cálculo de cargas", "Propuesta integral"] },
  { slug: "personalizadas", name: "Soluciones Personalizadas",
    desc: "Plataformas pre-fabricadas, barandas auto-soportadas y protectores de domo pre-fabricados.",
    bullets: ["Plataformas pre-fabricadas", "Barandas auto-soportadas", "Protectores de domo pre-fabricados"] },
  { slug: "supervision", name: "Supervisión",
    desc: "Supervisión profesional en sitio para trabajos de alto riesgo y maniobras críticas.",
    bullets: ["Vigilancia operativa", "Permisos de trabajo", "Bitácora diaria", "Auditorías relámpago"] },
  { slug: "certificacion", name: "Certificación",
    desc: "Certificación y re-certificación de sistemas, EPP y operadores con pruebas de carga.",
    bullets: ["Pruebas de carga", "Verificación periódica", "Re-certificación", "Documentación oficial"] },
  { slug: "instalacion", name: "Instalación",
    desc: "Instalación de líneas de vida, anclajes y sistemas removibles con instaladores certificados.",
    bullets: ["Instaladores certificados", "Cobertura nacional", "Acta entrega-recepción", "Plan de mantenimiento"] },
];

export const INDUSTRIES = [
  "Alimenticia", "Farmacéutica", "Siderúrgica", "Química", "Petroquímica",
  "Textil", "Automotriz", "Inmobiliaria", "Aeronáutica", "Telecomunicaciones",
  "Energía Eólica", "Plantas nucleares", "Manufacturera", "Camiones y Trenes",
  "Grúas", "Rack de Almacenamiento", "Mantenimiento de Edificios",
  "Anuncios Publicitarios", "Puentes", "Presas", "Centros Comerciales", "Estadios",
];

export type SolutionFamily = {
  slug: string;
  name: string;
  desc: string;
  apps: string[];
};

export const SOLUTION_FAMILIES: SolutionFamily[] = [
  { slug: "alturas", name: "Trabajos en Altura",
    desc: "Sistemas de protección contra caídas para cualquier estructura y altura de trabajo.",
    apps: ["Silos", "Techos industriales", "Torres y antenas", "Puentes y presas", "Estadios", "Anuncios publicitarios", "Rack de almacenamiento", "Domos"] },
  { slug: "confinados", name: "Espacios Confinados",
    desc: "Ingreso, rescate y monitoreo en tanques, ductos, fosas y atmósferas peligrosas.",
    apps: ["Tanques", "Ductos y tuberías", "Fosas y registros", "Reactores", "Silos cerrados"] },
  { slug: "ingenieria", name: "Ingeniería Estructural",
    desc: "Diseño, cálculo y fabricación de sistemas pre-fabricados y a la medida.",
    apps: ["Líneas de vida horizontales", "Líneas de vida verticales", "Anclajes certificados", "Barandales auto-soportados", "Plataformas pre-fabricadas", "Protectores de domo"] },
  { slug: "construccion", name: "Construcción y Obra",
    desc: "Acompañamiento de seguridad en obra civil, montaje industrial y mantenimiento mayor.",
    apps: ["Construcción nueva", "Mantenimiento mayor", "Paros de planta", "Montaje de estructuras", "Rack de tubería"] },
  { slug: "mantenimiento", name: "Mantenimiento Profesional",
    desc: "Mantenimiento preventivo y correctivo residencial e industrial: limpieza, pintura, impermeabilización y obra civil.",
    apps: ["Limpieza industrial", "Pintura", "Impermeabilización", "Obra civil", "Electricidad", "Programas preventivos"] },
];

// Legacy flat list kept for backwards compat — derived from families.
export const SOLUTIONS = SOLUTION_FAMILIES.map((f) => f.name);

export const PNPC_STATS = [
  { value: "11,789", label: "Personas Capacitadas" },
  { value: "2,094",  label: "Contratistas Capacitados" },
  { value: "96,312", label: "Horas Capacitadas" },
  { value: "1,494",  label: "Cursos Impartidos" },
];

export const TESTIMONIALS = [
  { name: "Lic. Ma. Del Carmen R. Pineda Chávez", role: "Cliente Corporativo",
    quote: "El programa de KAEE Group transformó nuestra cultura de seguridad: pasamos de procedimientos en papel a operación verificable en sitio." },
  { name: "L.I. Jose M. Hernández Mayo", role: "Jefe de Seguridad Industrial",
    quote: "La calidad técnica de los instructores y la documentación DC-3 nos permitió pasar auditorías STPS sin observaciones." },
  { name: "Abelardo Servin Torres", role: "Coordinador de Mantenimiento",
    quote: "Sus líneas de vida y anclajes resolvieron un problema que arrastrábamos hace años. Ingeniería seria, instalación impecable." },
];

export const DIVISIONS = [
  { tag: "01", name: "Capacitación",            desc: "Cursos DC-3, OSHA y entrenamiento técnico — presencial y en línea." },
  { tag: "02", name: "Servicios técnicos",      desc: "Consultoría, asesoría, supervisión, certificación e instalación." },
  { tag: "03", name: "Ingeniería",              desc: "Líneas de vida, anclajes, barandales, andamios, plataformas y escalas." },
  { tag: "04", name: "Equipo certificado",      desc: "EPP y equipo para trabajo en altura bajo norma internacional." },
  { tag: "05", name: "Inmuebles especializados", desc: "Mantenimiento, venta y renta de inmuebles aptos para trabajo en altura." },
];

export const CLIENTS_FULL = [
  "COCA-COLA FEMSA", "HOLCIM", "UNILEVER", "MERCK", "PETSTAR", "SANTA CLARA",
  "BIMBO", "NESTLÉ", "CEMEX", "HEINEKEN", "GRUPO MODELO", "PEMEX",
  "VOLKSWAGEN", "FORD", "NISSAN", "BAYER", "DANONE", "PROCTER & GAMBLE",
  "L'ORÉAL", "KIMBERLY-CLARK", "ARCA CONTINENTAL",
  "PIRELLI", "GENERAL MOTORS", "PFIZER", "CARGILL", "JOHNSON & JOHNSON",
  "CONOCO PHILLIPS", "VESTAS", "PEPSICO",
];

export const FAQS = [
  { q: "¿Qué es el método K.A.E.E.?", a: "Knowledge, Analysis, Engineering & Elimination: nuestra metodología propietaria para reducir a cero los accidentes en trabajos en altura." },
  { q: "¿Sus cursos están registrados ante STPS?", a: "Sí. Entregamos DC-3 oficial y certificado de cumplimiento con registro verificable en línea." },
  { q: "¿Tienen cobertura internacional?", a: "Sede en México (Toluca) con operación directa en México, Colombia, Chile, Estados Unidos y Canadá, y cobertura LATAM bajo la marca KG Safety Latam." },
  { q: "¿Cuánto tarda una cotización?", a: "Le respondemos el mismo día. Para ingeniería en sitio, agendamos visita técnica dentro de 72 horas hábiles." },
  { q: "¿Trabajan con contratistas externos?", a: "Sí, a través del Programa Nacional de Profesionalización a Contratistas (P.N.P.C.) que estandariza la seguridad de sus proveedores." },
  { q: "¿Cuáles son los niveles de capacitación?", a: "Tres niveles: Básico / Autorizado (8 h), Supervisor / Monitor (16 h) y Jefe de Seguridad / Competente (24 h). Adicionalmente impartimos OSHA 10 y OSHA 30." },
  { q: "¿Qué normas cumplen sus sistemas?", a: "NOM-009-STPS, NOM-033-STPS, OSHA 1910/1926, ANSI Z359, EN-795 y CSA Z259." },
  { q: "¿Puedo auto-facturar?", a: "Sí. En la sección Facturación accede al portal externo con su folio de cotización o referencia para generar su factura." },
];

// ===== Sprint 3 — Detalle profundo por slug =====

export type DetailBlock = {
  audience?: string[];
  norms?: string[];
  deliverables?: string[];
  evaluation?: string;
  practice?: string;
  brands?: string[];
  targets?: string[];
};

// Defaults compartidos entre cursos
const COURSE_DEFAULT_DELIVERABLES = [
  "DC-3 oficial STPS",
  "Certificado KG Safety",
  "Credencial anti-falsificación",
  "Material didáctico KAEE",
  "Lista de asistencia registrada",
];
const COURSE_DEFAULT_EVALUATION = "Examen teórico + práctica supervisada. Calificación mínima 80%.";

export const COURSE_DETAILS: Record<string, DetailBlock> = {
  alturas: {
    audience: ["Personal operativo > 1.8 m", "Supervisores de obra", "Jefes de seguridad"],
    norms: ["NOM-009-STPS-2011", "ANSI Z359", "OSHA 1926 Subparte M"],
    practice: "Uso de arnés, anclajes, plan de rescate y simulacro de caída.",
  },
  confinados: {
    audience: ["Cuadrillas de mantenimiento", "Brigadistas de rescate", "Supervisores HSE"],
    norms: ["NOM-033-STPS-2015", "OSHA 1910.146"],
    practice: "Monitoreo atmosférico, rescate vertical y permisos de ingreso.",
  },
  andamios: {
    audience: ["Armadores", "Supervisores de obra", "Inspectores"],
    norms: ["NOM-009-STPS-2011", "OSHA 1926 Subparte L"],
    practice: "Armado, inspección y tarjeta verde/roja.",
  },
  loto: {
    audience: ["Mantenimiento eléctrico y mecánico", "Operadores de planta"],
    norms: ["NOM-004-STPS", "OSHA 1910.147"],
    practice: "Bloqueo individual, candados de grupo y verificación de cero energía.",
  },
  electricidad: {
    audience: ["Electricistas industriales", "Mantenimiento"],
    norms: ["NFPA 70E", "NOM-029-STPS"],
    practice: "EPP dieléctrico, aterrizaje temporal y análisis de arco eléctrico.",
  },
  calor: {
    audience: ["Soldadores", "Vigilantes contra incendio", "Supervisores"],
    norms: ["NOM-027-STPS", "OSHA 1910.252"],
    practice: "Permiso de trabajo en caliente, vigilancia y control de chispa.",
  },
  herramientas: {
    audience: ["Personal operativo general"],
    norms: ["NOM-017-STPS"],
    practice: "Inspección pre-uso y bitácora de herramientas.",
  },
  "primeros-auxilios": {
    audience: ["Brigadistas", "Personal general"],
    norms: ["AHA / Cruz Roja Mexicana"],
    practice: "RCP, control de hemorragias, manejo de víctima e inmovilización.",
  },
  extintores: {
    audience: ["Brigadistas contra incendio", "Personal general"],
    norms: ["NOM-002-STPS", "NFPA 10"],
    practice: "Identificación de clase de fuego y operación de extintor portátil.",
  },
  montacargas: {
    audience: ["Operadores de montacargas", "Supervisores de almacén"],
    norms: ["NOM-006-STPS", "OSHA 1910.178"],
    practice: "Inspección pre-operacional y maniobras de carga.",
  },
  "osha-10": {
    audience: ["Personal operativo construcción / industria general"],
    norms: ["OSHA 29 CFR 1926 / 1910"],
    deliverables: ["Tarjeta oficial OSHA DOL", "Certificado de cumplimiento", "Material oficial OSHA"],
    practice: "Estudio de casos y reconocimiento de peligros.",
    evaluation: "Programa oficial Outreach OSHA — sin examen final.",
  },
  "osha-30": {
    audience: ["Supervisores y mandos medios"],
    norms: ["OSHA 29 CFR 1926 / 1910"],
    deliverables: ["Tarjeta oficial OSHA DOL", "Certificado de cumplimiento", "Material oficial OSHA"],
    practice: "Análisis de riesgos por subparte y planes de control.",
    evaluation: "Programa oficial Outreach OSHA — sin examen final.",
  },
};

export const courseDetail = (slug: string): Required<Pick<DetailBlock, "deliverables" | "evaluation">> & DetailBlock => {
  const d = COURSE_DETAILS[slug] ?? {};
  return {
    deliverables: d.deliverables ?? COURSE_DEFAULT_DELIVERABLES,
    evaluation: d.evaluation ?? COURSE_DEFAULT_EVALUATION,
    audience: d.audience,
    norms: d.norms,
    practice: d.practice,
  };
};

// Equipos
export const EQUIPMENT_DETAILS: Record<string, DetailBlock> = {
  epp: {
    norms: ["ANSI Z359.11", "EN 361", "CSA Z259.10"],
    brands: ["Petzl", "MSA", "3M", "Honeywell", "Miller"],
    targets: ["Operaciones generales en altura", "Mantenimiento industrial", "Construcción"],
  },
  conexion: {
    norms: ["ANSI Z359.13", "EN 354 / 355"],
    brands: ["3M", "Petzl", "MSA", "Capital Safety"],
    targets: ["Conexión arnés-anclaje", "Trabajos verticales y horizontales"],
  },
  anclajes: {
    norms: ["ANSI Z359.18", "EN 795 tipos A/B/D"],
    brands: ["Petzl", "MSA", "Tractel", "Capital Safety"],
    targets: ["Concreto, metal, madera", "Anclajes fijos y removibles"],
  },
  "lineas-de-vida": {
    norms: ["ANSI Z359.6", "EN 795 tipos C/D", "NOM-009-STPS"],
    brands: ["Tractel", "3M", "Capital Safety", "Petzl"],
    targets: ["Naves industriales", "Techos y silos", "Líneas de proceso"],
  },
  barandales: {
    norms: ["OSHA 1910.29", "NOM-009-STPS"],
    targets: ["Perímetros de techo", "Plataformas elevadas", "Fosas y registros"],
  },
  domos: {
    norms: ["OSHA 1910.28", "ANSI Z359"],
    targets: ["Domos traslúcidos y de rejilla", "Techos con riesgo de caída a través"],
  },
  andamios: {
    norms: ["NOM-009-STPS", "OSHA 1926 Subparte L"],
    brands: ["Ulma", "Layher", "Andamios Atlas"],
    targets: ["Mantenimiento de fachadas", "Obra civil", "Paros de planta"],
  },
  plataformas: {
    norms: ["ANSI A92", "OSHA 1910.27"],
    targets: ["Mantenimiento elevado", "Accesos prefabricados", "Manlift"],
  },
  pasos: {
    norms: ["OSHA 1910.23", "NOM-001-STPS"],
    targets: ["Acceso vertical permanente", "Escaleras de servicio"],
  },
  escalas: {
    norms: ["OSHA 1910.23", "EN 14122"],
    targets: ["Escalas marinas y verticales", "Acceso con guarda-hombre"],
  },
};

// Ingeniería
export const ENGINEERING_DETAILS: Record<string, DetailBlock> = {
  asesoria: {
    deliverables: ["Diagnóstico inicial documentado", "Análisis de riesgo", "Recomendaciones normativas", "Reporte ejecutivo PDF"],
    norms: ["NOM-009-STPS", "OSHA 1910/1926", "ANSI Z359"],
    targets: ["Plantas industriales", "Centros logísticos", "Obra civil"],
  },
  consultoria: {
    deliverables: ["Levantamiento topográfico", "Cálculo de cargas", "Propuesta integral", "Cronograma de implementación"],
    norms: ["NOM-009-STPS", "EN 795", "ANSI Z359"],
    targets: ["Estructuras existentes", "Nueva construcción"],
  },
  personalizadas: {
    deliverables: ["Memoria de cálculo", "Planos de fabricación", "Pruebas de carga", "Acta entrega-recepción"],
    norms: ["NOM-009-STPS", "EN 795 tipo D"],
    targets: ["Plataformas pre-fabricadas", "Barandas auto-soportadas", "Protectores de domo"],
  },
  supervision: {
    deliverables: ["Permiso de trabajo diario", "Bitácora HSE", "Auditorías relámpago", "Informe final con evidencia fotográfica"],
    norms: ["NOM-031-STPS", "OSHA 1926"],
    targets: ["Paros de planta", "Maniobras críticas", "Obra de alto riesgo"],
  },
  certificacion: {
    deliverables: ["Pruebas de carga firmadas", "Certificado anual", "Etiqueta de inspección", "Re-certificación programada"],
    norms: ["ANSI Z359.7", "EN 365", "NOM-009-STPS"],
    targets: ["Líneas de vida existentes", "Anclajes individuales", "Sistemas perimetrales"],
  },
  instalacion: {
    deliverables: ["Acta entrega-recepción", "Memoria fotográfica", "Plan de mantenimiento", "Manual de usuario"],
    norms: ["EN 795", "ANSI Z359.18", "NOM-009-STPS"],
    targets: ["Cobertura nacional", "Instaladores certificados", "Materiales con trazabilidad"],
  },
};

// ===== Sprint 5 — Servicios individuales =====

export type ServiceDetail = {
  slug: string;
  name: string;
  short: string;          // tagline/H1 secondary
  problem: string;        // qué dolor resuelve
  includes: string[];     // qué incluye
  deliverables: string[]; // entregables documentales
  norms: string[];        // normas relacionadas
  whenToHire: string[];   // cuándo contratarlo
  parent?: "WoLL" | "MS&S" | "W@H" | "S@H" | "SoNs";
};

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    slug: "consultoria",
    name: "Consultoría técnica en sitio",
    short: "Visita técnica, mediciones y propuesta integral con un ingeniero responsable.",
    problem: "Su planta tiene riesgo en altura pero nadie ha mapeado dónde, cuántos usuarios, qué frecuencia ni qué sistema cumple norma.",
    includes: ["Visita técnica con ingeniero", "Mediciones y levantamiento", "Cálculo preliminar de cargas", "Propuesta técnico-económica priorizada"],
    deliverables: ["Reporte de visita firmado", "Levantamiento fotográfico", "Memoria de cálculo preliminar", "Propuesta integral PDF"],
    norms: ["NOM-009-STPS", "ANSI Z359", "EN 795"],
    whenToHire: ["Inicio de proyecto", "Antes de auditoría externa", "Cambio de uso de planta", "Nuevo CapEx HSE"],
    parent: "MS&S",
  },
  {
    slug: "asesoria",
    name: "Asesoría normativa",
    short: "Acompañamiento técnico-normativo sin visita obligatoria. Para resolver dudas de cumplimiento.",
    problem: "Tiene observaciones de auditoría o STPS y no sabe qué norma aplica ni qué evidencia entregar.",
    includes: ["Revisión documental", "Mapeo normativo (STPS/OSHA/ANSI)", "Recomendaciones por escrito", "Sesión de aclaración con su equipo HSE"],
    deliverables: ["Dictamen normativo", "Matriz NOM/OSHA/ANSI", "Plan de cierre de hallazgos"],
    norms: ["NOM-009-STPS", "NOM-033-STPS", "OSHA 1910/1926", "ANSI Z359"],
    whenToHire: ["Después de una observación", "Antes de una auditoría", "Cambio normativo reciente"],
    parent: "MS&S",
  },
  {
    slug: "soluciones-personalizadas",
    name: "Soluciones personalizadas",
    short: "Diseño y fabricación de sistemas a la medida cuando el catálogo no resuelve.",
    problem: "Su estructura es atípica: silo irregular, techo curvo, equipo único. Ningún sistema estándar funciona.",
    includes: ["Diseño mecánico", "Memoria de cálculo", "Fabricación bajo plano", "Pruebas de carga en campo"],
    deliverables: ["Planos de fabricación", "Memoria de cálculo firmada", "Reporte de pruebas de carga", "Manual de usuario"],
    norms: ["EN 795 tipo D", "ANSI Z359.6", "NOM-009-STPS"],
    whenToHire: ["Estructuras atípicas", "Restricciones arquitectónicas", "Requisitos de cliente final"],
    parent: "WoLL",
  },
  {
    slug: "supervision",
    name: "Supervisión de obra y maniobras",
    short: "Ingeniero o técnico HSE en sitio durante trabajos de alto riesgo o paros de planta.",
    problem: "Necesita un responsable técnico independiente que firme permisos, vigile cuadrillas y deje evidencia auditable.",
    includes: ["Vigilancia operativa diaria", "Emisión de permisos de trabajo", "Bitácora HSE", "Auditorías relámpago a contratistas"],
    deliverables: ["Permisos de trabajo firmados", "Bitácora diaria", "Memoria fotográfica", "Informe final con hallazgos"],
    norms: ["NOM-031-STPS", "NOM-009-STPS", "OSHA 1926"],
    whenToHire: ["Paros de planta", "Maniobras críticas", "Obra de alto riesgo", "Auditorías de cliente"],
    parent: "MS&S",
  },
  {
    slug: "certificacion",
    name: "Certificación e inspección anual",
    short: "Pruebas de carga, verificación periódica y re-certificación de sistemas y EPP.",
    problem: "Sus líneas de vida, anclajes o EPP llevan años en operación sin certificación vigente — auditoría no los aceptará.",
    includes: ["Pruebas de carga", "Verificación visual y dimensional", "Re-certificación documental", "Etiquetado de inspección"],
    deliverables: ["Certificado anual por sistema", "Reporte de pruebas firmado", "Etiqueta de inspección con QR", "Calendario de re-certificación"],
    norms: ["ANSI Z359.7", "EN 365", "NOM-009-STPS"],
    whenToHire: ["Anualmente", "Después de una caída", "Cambio de uso", "Antes de auditoría externa"],
    parent: "MS&S",
  },
  {
    slug: "instalacion",
    name: "Instalación certificada",
    short: "Instalación de líneas de vida, anclajes y sistemas con instaladores propios certificados.",
    problem: "Compró el sistema pero el proveedor no lo instala, o lo instalan electricistas sin certificación — pierde la garantía.",
    includes: ["Instaladores propios certificados", "Cobertura nacional", "Pruebas de carga post-instalación", "Acta entrega-recepción"],
    deliverables: ["Acta entrega-recepción firmada", "Reporte de pruebas de carga", "Manual de usuario", "Plan de mantenimiento anual"],
    norms: ["EN 795", "ANSI Z359.18", "NOM-009-STPS"],
    whenToHire: ["Sistemas nuevos", "Ampliaciones", "Reubicación de planta"],
    parent: "WoLL",
  },
  {
    slug: "renta",
    name: "Renta de equipo y plataformas",
    short: "EPP, líneas de vida temporales y plataformas en renta para proyectos puntuales.",
    problem: "Tiene un proyecto de 2 semanas — no le conviene comprar EPP, plataformas o líneas de vida que después no usará.",
    includes: ["EPP en renta con trazabilidad", "Líneas de vida temporales", "Plataformas y andamios", "Logística entrega/retiro"],
    deliverables: ["Contrato de renta", "Ficha técnica del equipo", "Certificado de inspección pre-renta", "Bitácora de uso"],
    norms: ["ANSI Z359", "NOM-009-STPS"],
    whenToHire: ["Paros de planta", "Mantenimiento mayor", "Obra de corto plazo", "Pico estacional"],
    parent: "S@H",
  },
  {
    slug: "analisis-de-riesgo",
    name: "Análisis de riesgo en altura",
    short: "Identificación, evaluación y priorización del riesgo de caída por punto de trabajo.",
    problem: "Sabe que hay riesgo pero no tiene matriz, prioridades ni evidencia documental para defender decisiones.",
    includes: ["Identificación de tareas críticas", "Evaluación HRN/JSA", "Matriz de riesgo por punto", "Plan de mitigación priorizado"],
    deliverables: ["Matriz de riesgo en altura", "JSA por tarea", "Plan de mitigación con CapEx estimado"],
    norms: ["NOM-030-STPS", "ANSI/AIHA Z10", "ISO 31000"],
    whenToHire: ["Antes de diseñar el sistema", "Después de un incidente", "Cambio de proceso"],
    parent: "MS&S",
  },
  {
    slug: "plan-de-rescate",
    name: "Plan de rescate en altura",
    short: "Procedimiento, equipo y brigada entrenada para rescatar a un trabajador suspendido en menos de 6 minutos.",
    problem: "Tiene arneses y líneas de vida — pero si alguien queda suspendido, nadie sabe qué hacer. El trauma por suspensión mata.",
    includes: ["Procedimiento por escenario", "Selección y compra de equipo de rescate", "Capacitación de brigada", "Simulacro anual"],
    deliverables: ["Plan de rescate por planta", "Procedimiento por escenario", "Constancia de brigada entrenada", "Bitácora de simulacro"],
    norms: ["NOM-009-STPS art. 13", "ANSI Z359.4", "OSHA 1910.146"],
    whenToHire: ["Obligatorio con cualquier sistema de protección contra caídas", "Después de un incidente"],
    parent: "W@H",
  },
  {
    slug: "inspeccion-certificacion-anual",
    name: "Inspección y certificación anual",
    short: "Programa anual de inspección documental y física de sistemas y EPP de protección contra caídas.",
    problem: "No tiene un calendario claro de inspecciones — cuando viene auditoría, no encuentra los reportes ni las etiquetas.",
    includes: ["Inventario de sistemas y EPP", "Calendario de inspección", "Inspección visual y de carga", "Reporte y etiquetado"],
    deliverables: ["Inventario digital con QR", "Calendario anual de inspección", "Reportes firmados por sistema", "Etiquetas físicas vigentes"],
    norms: ["ANSI Z359.7", "EN 365", "NOM-009-STPS"],
    whenToHire: ["Anualmente", "Inicio de programa HSE", "Cambio de proveedor anterior"],
    parent: "MS&S",
  },
];

export const serviceDetail = (slug: string) => SERVICE_DETAILS.find((s) => s.slug === slug);

// ===== Sprint 5 — Curso enriquecido =====
export type CourseDeep = {
  risks?: string[];           // riesgos específicos que controla
  syllabus?: string[];        // temario
  apps?: string[];            // aplicaciones industriales
  duration?: string;          // duración resumen
};
export const COURSE_DEEP: Record<string, CourseDeep> = {
  alturas: {
    risks: ["Caída a distinto nivel > 1.8 m", "Falla de anclaje", "Trauma por suspensión", "Caída de objetos"],
    syllabus: ["Marco normativo NOM-009 / ANSI Z359 / OSHA 1926", "Componentes del sistema personal de detención de caídas", "Cálculo de distancia de caída libre y total", "Selección de anclajes y conectores", "Plan de rescate y trauma por suspensión", "Inspección y descarte de EPP", "Práctica con arnés, línea de vida y rescate"],
    apps: ["Techos industriales", "Silos y tanques", "Torres y antenas", "Estructuras temporales"],
    duration: "8 / 16 / 24 horas según nivel",
  },
  confinados: {
    risks: ["Atmósferas IDLH", "Deficiencia de oxígeno", "Atrapamiento", "Inundación súbita"],
    syllabus: ["NOM-033-STPS / OSHA 1910.146", "Permiso de ingreso", "Monitoreo atmosférico de 4 gases", "Ventilación forzada", "Rescate vertical no-entry", "Práctica de ingreso y extracción"],
    apps: ["Tanques", "Ductos y tuberías", "Fosas y registros", "Reactores", "Silos cerrados"],
    duration: "8 / 16 / 24 horas según nivel",
  },
  herramientas: {
    risks: ["Proyección de partículas", "Cortes y aplastamiento", "Caída de herramienta desde altura", "Energías peligrosas"],
    syllabus: ["NOM-017-STPS", "Inspección pre-uso", "Amarre de herramienta en altura (drop prevention)", "Mantenimiento y descarte", "Bitácora de herramienta"],
    apps: ["Mantenimiento industrial", "Construcción", "Trabajo en altura con herramienta"],
    duration: "8 horas",
  },
  extintores: {
    risks: ["Incendio incipiente clases A/B/C/D/K", "Propagación", "Asfixia por humo"],
    syllabus: ["NOM-002-STPS / NFPA 10", "Identificación de clase de fuego", "Selección y operación de extintor portátil", "Brigadas y comunicación", "Práctica con fuego real controlado"],
    apps: ["Brigadas internas", "Almacenes", "Talleres", "Oficinas"],
    duration: "8 horas",
  },
  andamios: {
    risks: ["Colapso por mal armado", "Caída de altura", "Caída de material", "Sobrecarga"],
    syllabus: ["NOM-009-STPS / OSHA 1926 Subparte L", "Tipos: multidireccional, fachada, suspendido", "Armado seguro y tarjeta verde/roja", "Plataforma y baranda", "Inspección diaria"],
    apps: ["Obra civil", "Mantenimiento de fachadas", "Paros de planta"],
    duration: "8 / 16 / 24 horas según nivel",
  },
};
export const courseDeep = (slug: string) => COURSE_DEEP[slug] ?? {};

// ===== Sprint 5 — Equipos enriquecidos =====
export type EquipmentDeep = {
  subcategories?: string[];   // tipos / variantes
  selection?: string[];       // criterios de selección
  docs?: string[];            // documentos entregables
};
export const EQUIPMENT_DEEP: Record<string, EquipmentDeep> = {
  epp: {
    subcategories: ["Arnés de cuerpo completo", "Cascos clase E/G", "Calzado dieléctrico", "Guantes mecánicos / químicos", "Protección facial y ocular", "Protección auditiva"],
    selection: ["Tarea y peligro dominante", "Talla y antropometría", "Compatibilidad con otros EPP", "Frecuencia de uso", "Condiciones ambientales"],
    docs: ["Ficha técnica", "Certificado ANSI/EN", "Manual del usuario", "Etiqueta de inspección"],
  },
  conexion: {
    subcategories: ["Eslinga con amortiguador simple", "Eslinga doble pernera Y", "Retráctil 2.5 / 6 / 15 m", "Eslinga de posicionamiento", "Mosquetones triple seguro"],
    selection: ["Distancia de caída disponible", "Número de puntos de anclaje", "Movilidad requerida", "Carga / factor de caída"],
    docs: ["Ficha técnica", "Certificado ANSI Z359.13", "Bitácora de inspección"],
  },
  anclajes: {
    subcategories: ["Anillo D", "Push-Lock", "Postes individuales", "Platos para concreto/metal/madera", "Anclajes removibles"],
    selection: ["Sustrato (concreto/metal/madera)", "Carga estática requerida (22 kN)", "Permanente vs removible", "Acceso para inspección"],
    docs: ["Memoria de cálculo", "Ficha técnica", "Certificado EN 795", "Etiqueta con torque"],
  },
  "lineas-de-vida": {
    subcategories: ["Horizontales en cable", "Horizontales en riel", "Verticales en cable con freno", "Verticales en riel", "Temporales", "Over Head / Roof Top / Man Safe", "Inclinadas", "Montadas sobre pared"],
    selection: ["Número de usuarios simultáneos", "Tipo de superficie y pendiente", "Frecuencia y duración de uso", "Ruta y geometría", "Plan de rescate", "Distancia de caída disponible"],
    docs: ["Memoria de cálculo", "Planos as-built", "Certificado anual", "Bitácora de inspección", "Plan de rescate"],
  },
  barandales: {
    subcategories: ["Fijo concreto / lámina / pesas / rolado / engargolado", "Removible concreto / lámina / pesas"],
    selection: ["Permanente vs temporal", "Carga horizontal (200 lbf OSHA)", "Sustrato y método de fijación", "Estética y arquitectura"],
    docs: ["Memoria de cálculo", "Planos de fabricación", "Acta entrega-recepción"],
  },
  domos: {
    subcategories: ["Protector fijo", "Protector removible", "Rejilla", "Estructural traslúcido"],
    selection: ["Tipo de domo (traslúcido/opaco)", "Carga puntual y distribuida", "Acceso para mantenimiento", "Compatibilidad con sistema de fijación"],
    docs: ["Ficha técnica", "Memoria de cálculo", "Garantía estructural"],
  },
  andamios: {
    subcategories: ["Multidireccional", "De seguridad", "Suspendido", "Móvil"],
    selection: ["Altura y geometría", "Carga de trabajo (luz/media/pesada)", "Tiempo de obra", "Acceso al sitio"],
    docs: ["Tarjeta verde/roja", "Memoria de cálculo", "Bitácora diaria"],
  },
  plataformas: {
    subcategories: ["Fija construida en sitio", "Prefabricada modular", "Fabricada a medida", "Móvil / Manlift"],
    selection: ["Frecuencia de uso", "Carga y número de usuarios", "Restricciones arquitectónicas", "Norma de barandal y rodapié"],
    docs: ["Memoria de cálculo", "Planos", "Acta entrega-recepción", "Manual del usuario"],
  },
  pasos: {
    subcategories: ["Metálicos", "Sintéticos / fibra de vidrio dieléctrica", "Con jaula de seguridad", "Con sistema vertical certificado"],
    selection: ["Altura total", "Riesgo eléctrico", "Norma OSHA 1910.23 / NOM-001", "Compatibilidad con sistema vertical"],
    docs: ["Ficha técnica", "Memoria de cálculo", "Certificado de instalación"],
  },
  escalas: {
    subcategories: ["Verticales con guarda-hombre", "Marinas con sistema vertical", "Inclinadas", "Removibles"],
    selection: ["Altura total y descansos", "Frecuencia de uso", "Riesgo eléctrico", "Norma EN 14122 / OSHA 1910.23"],
    docs: ["Ficha técnica", "Planos as-built", "Certificado de instalación"],
  },
};
export const equipmentDeep = (slug: string) => EQUIPMENT_DEEP[slug] ?? {};

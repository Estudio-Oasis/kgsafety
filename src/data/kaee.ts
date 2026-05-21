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
  { tag: "W@H",  name: "Working at Heights",      desc: "Capacitación y entrenamiento — presencial y en línea." },
  { tag: "MS&S", name: "Mantenimiento, Servicios & Soluciones", desc: "Consultoría, asesoría, supervisión, certificación e instalación." },
  { tag: "WoLL", name: "Working on Life Lines",   desc: "Líneas de vida, anclajes, barandales, andamios, plataformas, pasos de gato y escalas." },
  { tag: "S@H",  name: "Safety @ Heights",        desc: "Tienda en línea de EPP y equipo certificado." },
  { tag: "SoNs", name: "SoNs Real State",         desc: "Mantenimiento, venta y renta de inmuebles especializados en alturas." },
];

export const CLIENTS_FULL = [
  "COCA-COLA FEMSA", "HOLCIM", "UNILEVER", "MERCK", "PETSTAR", "SANTA CLARA",
  "BIMBO", "NESTLÉ", "CEMEX", "HEINEKEN", "GRUPO MODELO", "PEMEX",
  "VOLKSWAGEN", "FORD", "NISSAN", "BAYER", "DANONE", "PROCTER & GAMBLE",
  "L'ORÉAL", "KIMBERLY-CLARK", "ARCA CONTINENTAL",
];

export const FAQS = [
  { q: "¿Qué es el método K.A.E.E.?", a: "Knowledge, Analysis, Engineering & Elimination: nuestra metodología propietaria para reducir a cero los accidentes en trabajos en altura." },
  { q: "¿Sus cursos están registrados ante STPS?", a: "Sí. Entregamos DC-3 oficial y certificado de cumplimiento con registro verificable en línea." },
  { q: "¿Tienen cobertura internacional?", a: "Sede en México (Toluca) con operación en Colombia, Estados Unidos y Argentina, y cobertura LATAM bajo la marca KG Safety Latam." },
  { q: "¿Cuánto tarda una cotización?", a: "Le respondemos el mismo día. Para ingeniería en sitio, agendamos visita técnica dentro de 72 horas hábiles." },
  { q: "¿Trabajan con contratistas externos?", a: "Sí, a través del Programa Nacional de Profesionalización a Contratistas (P.N.P.C.) que estandariza la seguridad de sus proveedores." },
  { q: "¿Cuáles son los niveles de capacitación?", a: "Tres niveles: Básico / Autorizado (8 h), Supervisor / Monitor (16 h) y Jefe de Seguridad / Competente (24 h). Adicionalmente impartimos OSHA 10 y OSHA 30." },
  { q: "¿Qué normas cumplen sus sistemas?", a: "NOM-009-STPS, NOM-033-STPS, OSHA 1910/1926, ANSI Z359, EN-795 y CSA Z259." },
  { q: "¿Puedo auto-facturar?", a: "Sí. En la sección Facturación accede al portal externo con su folio de cotización o referencia para generar su factura." },
];

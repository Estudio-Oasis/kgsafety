// KAEE Group FPCS — site data extracted from kaeegroupfpcs.com reference package.
// All copy preserved literally where possible.

export type CourseLevel = {
  code: "A" | "M" | "C" | "P";
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
  { code: "A", name: "Autorizado",  hours: "8 h",  desc: `Persona autorizada para ejecutar tareas de ${area} con uso correcto del EPP y procedimientos seguros.` },
  { code: "M", name: "Monitor",     hours: "16 h", desc: `Monitor capaz de supervisar cuadrillas y verificar condiciones de seguridad durante trabajos de ${area}.` },
  { code: "C", name: "Competente",  hours: "24 h", desc: `Persona competente con criterio para identificar riesgos, planear maniobras y emitir permisos de ${area}.` },
  { code: "P", name: "Profesional", hours: "40 h", desc: `Profesional certificado para diseñar planes, capacitar internamente y firmar protocolos de ${area}.` },
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
  { slug: "incendios",     name: "Incendios",             short: "Incendios",
    desc: "Prevención, brigadas y combate con extintor portátil bajo NOM-002-STPS.",
    levels: STANDARD_LEVELS("incendios") },
  { slug: "montacargas",   name: "Montacargas",           short: "Montacargas",
    desc: "Operación segura, inspección y maniobras certificadas de montacargas.",
    levels: STANDARD_LEVELS("montacargas") },
  { slug: "plataformas",   name: "Uso de Plataformas",    short: "Plataformas",
    desc: "Operación segura de manlifts, tijeras y plataformas articuladas.",
    levels: STANDARD_LEVELS("plataformas elevadoras") },
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
  { slug: "renta", name: "Renta de Equipo",
    desc: "Renta de barandas, sistemas contra caídas y andamios por proyecto u obra.",
    bullets: ["Barandas", "Sistemas contra caídas", "Andamios", "Logística incluida"] },
];

export const INDUSTRIES = [
  "Alimenticia", "Farmacéutica", "Siderúrgica", "Química", "Petroquímica",
  "Textil", "Automotriz", "Inmobiliaria", "Aeronáutica", "Telecomunicaciones",
  "Energía Eólica", "Plantas nucleares", "Manufacturera", "Camiones y Trenes",
  "Grúas", "Rack de Almacenamiento", "Mantenimiento de Edificios",
  "Anuncios Publicitarios", "Puentes", "Presas", "Centros Comerciales", "Estadios",
];

export const SOLUTIONS = [
  "Silos", "Techos", "Espacios Confinados", "Construcción", "Rack de Tubería",
];

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
  { q: "¿Sus cursos están registrados ante STPS?", a: "Sí. Entregamos DC-3 oficial, certificado de cumplimiento y credencial con candados anti-falsificación." },
  { q: "¿Tienen cobertura nacional?", a: "Sí. Operamos en toda la República Mexicana, con presencia adicional en Colombia y Chile." },
  { q: "¿Manejan renta de equipos?", a: "Sí. Rentamos barandas, sistemas contra caídas y andamios por proyecto u obra, con logística incluida." },
  { q: "¿Cuánto tarda una cotización?", a: "Le respondemos el mismo día. Para ingeniería en sitio, agendamos visita técnica dentro de 72 horas hábiles." },
  { q: "¿Trabajan con contratistas externos?", a: "Sí, a través del Programa Nacional de Profesionalización a Contratistas (P.N.P.C.) que estandariza la seguridad de sus proveedores." },
  { q: "¿Cuáles son los niveles de capacitación?", a: "Cuatro niveles: Autorizado (8 h), Monitor (16 h), Competente (24 h) y Profesional (40 h)." },
  { q: "¿Qué normas cumplen sus sistemas?", a: "NOM-009-STPS, NOM-033-STPS, OSHA 1910/1926, ANSI Z359, EN-795 y CSA Z259." },
];

// Datos ficticios para el Portal KG Safety (prototipo).
// Toda la información es simulada — no usar en producción.

export type Role = "cliente-corp" | "cliente-planta" | "admin-kg" | "equipo-kg";

export type CertState = "vigente" | "por-vencer-60" | "por-vencer-30" | "vencido";
export type ProjectStatus = "completado" | "en-curso" | "pendiente" | "revision";
export type DocType =
  | "factura"
  | "cotizacion"
  | "orden-compra"
  | "certificado"
  | "ficha-tecnica"
  | "reporte"
  | "evidencia"
  | "acta"
  | "bitacora";

export type ProjectType =
  | "Línea de vida"
  | "Certificación"
  | "Capacitación"
  | "Supervisión"
  | "Instalación"
  | "Inspección"
  | "Consultoría"
  | "Asesoría"
  | "Plan de rescate"
  | "Análisis de riesgo";

export type Client = {
  slug: string;
  name: string;
  industry: string;
  plants: number;
};

export type Plant = {
  slug: string;
  name: string;
  clientSlug: string;
  location: string;
  industry: string;
  responsable: string;
  email: string;
};

export type SystemInstalled = {
  id: string;
  plantSlug: string;
  type: string;
  ubicacion: string;
  metros?: number;
  norma: string;
};

export type Project = {
  id: string;
  name: string;
  type: ProjectType;
  clientSlug: string;
  plantSlug: string;
  fecha: string; // ISO
  responsable: string;
  status: ProjectStatus;
  descripcion: string;
};

export type Certification = {
  id: string;
  systemId: string;
  plantSlug: string;
  ultima: string; // ISO
  vencimiento: string; // ISO
};

export type Document = {
  id: string;
  type: DocType;
  name: string;
  projectId: string;
  plantSlug: string;
  fecha: string;
  size: string;
};

export type Invoice = {
  folio: string;
  fecha: string;
  projectId: string;
  clientSlug: string;
  monto: number;
  status: "pagada" | "pendiente" | "vencida";
};

export type LibraryDoc = {
  id: string;
  category: string;
  name: string;
  fecha: string;
  size: string;
};

// ============= CLIENTES =============
export const CLIENTS: Client[] = [
  { slug: "femsa", name: "Coca-Cola FEMSA", industry: "Bebidas", plants: 2 },
  { slug: "holcim", name: "Holcim", industry: "Cemento", plants: 1 },
  { slug: "merck", name: "Merck", industry: "Farmacéutica", plants: 1 },
  { slug: "petstar", name: "PetStar", industry: "Reciclaje PET", plants: 1 },
  { slug: "pirelli", name: "Pirelli", industry: "Llantas", plants: 1 },
  { slug: "pfizer", name: "Pfizer", industry: "Farmacéutica", plants: 1 },
  { slug: "cargill", name: "Cargill", industry: "Agroindustria", plants: 1 },
  { slug: "jnj", name: "Johnson & Johnson", industry: "Cuidado personal", plants: 1 },
  { slug: "owens", name: "Owens Illinois", industry: "Vidrio", plants: 1 },
  { slug: "unilever", name: "Unilever", industry: "Consumo", plants: 1 },
  { slug: "vestas", name: "Vestas", industry: "Energía eólica", plants: 1 },
  { slug: "gamesa", name: "Gamesa Eólica", industry: "Energía eólica", plants: 1 },
  { slug: "pepsico", name: "PepsiCo", industry: "Alimentos y bebidas", plants: 1 },
  { slug: "gm", name: "General Motors", industry: "Automotriz", plants: 1 },
  { slug: "conoco", name: "Conoco Phillips", industry: "Energía / Infraestructura", plants: 1 },
  { slug: "tupperware", name: "Tupperware", industry: "Plásticos", plants: 1 },
];

// ============= PLANTAS =============
export const PLANTS: Plant[] = [
  { slug: "holcim-queretaro", name: "Holcim Querétaro", clientSlug: "holcim", location: "Querétaro, Qro.", industry: "Cemento", responsable: "Ing. Marco Salazar", email: "msalazar@holcim.com" },
  { slug: "merck-toluca", name: "Merck Toluca", clientSlug: "merck", location: "Toluca, Edo. Méx.", industry: "Farmacéutica", responsable: "Ing. Lucía Hernández", email: "lhernandez@merck.com" },
  { slug: "femsa-toluca", name: "Coca-Cola FEMSA Toluca", clientSlug: "femsa", location: "Toluca, Edo. Méx.", industry: "Bebidas", responsable: "Ing. Roberto Cárdenas", email: "rcardenas@kof.com" },
  { slug: "femsa-apizaco", name: "Coca-Cola FEMSA Apizaco", clientSlug: "femsa", location: "Apizaco, Tlax.", industry: "Bebidas", responsable: "Ing. Sandra Morales", email: "smorales@kof.com" },
  { slug: "petstar-toluca", name: "PetStar Toluca", clientSlug: "petstar", location: "Toluca, Edo. Méx.", industry: "Reciclaje", responsable: "Ing. Eduardo Ramos", email: "eramos@petstar.mx" },
  { slug: "pirelli-silao", name: "Pirelli Silao", clientSlug: "pirelli", location: "Silao, Gto.", industry: "Llantas", responsable: "Ing. Carla Vázquez", email: "cvazquez@pirelli.com" },
  { slug: "pfizer-toluca", name: "Pfizer Toluca", clientSlug: "pfizer", location: "Toluca, Edo. Méx.", industry: "Farmacéutica", responsable: "Ing. Jorge Domínguez", email: "jdominguez@pfizer.com" },
  { slug: "cargill-atitalaquia", name: "Cargill Atitalaquia", clientSlug: "cargill", location: "Atitalaquia, Hgo.", industry: "Agroindustria", responsable: "Ing. Patricia Núñez", email: "pnunez@cargill.com" },
  { slug: "unilever-tultitlan", name: "Unilever Tultitlán", clientSlug: "unilever", location: "Tultitlán, Edo. Méx.", industry: "Consumo", responsable: "Ing. Mario Reyes", email: "mreyes@unilever.com" },
  { slug: "gamesa-oaxaca", name: "Gamesa Eólica Oaxaca", clientSlug: "gamesa", location: "La Ventosa, Oax.", industry: "Eólica", responsable: "Ing. Daniela Estrada", email: "destrada@gamesa.com" },
  { slug: "vestas-norte", name: "Vestas Parque Norte", clientSlug: "vestas", location: "Reynosa, Tamps.", industry: "Eólica", responsable: "Ing. Hugo Pérez", email: "hperez@vestas.com" },
  { slug: "gm-silao", name: "General Motors Silao", clientSlug: "gm", location: "Silao, Gto.", industry: "Automotriz", responsable: "Ing. Verónica Luna", email: "vluna@gm.com" },
  { slug: "jnj-juarez", name: "Johnson & Johnson Juárez", clientSlug: "jnj", location: "Cd. Juárez, Chih.", industry: "Cuidado personal", responsable: "Ing. Alfredo Mejía", email: "amejia@jnj.com" },
  { slug: "owens-toluca", name: "Owens Illinois Toluca", clientSlug: "owens", location: "Toluca, Edo. Méx.", industry: "Vidrio", responsable: "Ing. Karina Soto", email: "ksoto@o-i.com" },
  { slug: "pepsico-mexicali", name: "PepsiCo Mexicali", clientSlug: "pepsico", location: "Mexicali, B.C.", industry: "Alimentos", responsable: "Ing. Andrés Téllez", email: "atellez@pepsico.com" },
  { slug: "conoco-altamira", name: "Conoco Phillips Altamira", clientSlug: "conoco", location: "Altamira, Tamps.", industry: "Energía / Infraestructura", responsable: "Ing. Fernanda Ruiz", email: "fruiz@conocophillips.com" },
  { slug: "tupperware-atlacomulco", name: "Tupperware Atlacomulco", clientSlug: "tupperware", location: "Atlacomulco, Edo. Méx.", industry: "Plásticos", responsable: "Ing. Sergio Aguilar", email: "saguilar@tupperware.com" },
];

// ============= SISTEMAS INSTALADOS =============
const SYSTEM_TYPES = [
  "Línea de vida horizontal flexible",
  "Línea de vida vertical rígida",
  "Puntos de anclaje certificados",
  "Barandales autoportantes",
  "Escala marina con riel",
  "Plataforma de mantenimiento",
];

export const SYSTEMS: SystemInstalled[] = PLANTS.flatMap((p, i) => {
  const count = 1 + (i % 3); // 1-3 sistemas por planta
  return Array.from({ length: count }, (_, k) => ({
    id: `sys-${p.slug}-${k + 1}`,
    plantSlug: p.slug,
    type: SYSTEM_TYPES[(i + k) % SYSTEM_TYPES.length],
    ubicacion: ["Nave A", "Nave B", "Techumbre", "Silos", "Patio de tanques"][(i + k) % 5],
    metros: 30 + ((i + k) * 12) % 180,
    norma: ["NOM-009-STPS", "ANSI Z359.1", "OSHA 1910.140", "EN-795"][(i + k) % 4],
  }));
});

// ============= PROYECTOS =============
const PROJECT_TYPES: ProjectType[] = [
  "Línea de vida",
  "Certificación",
  "Capacitación",
  "Supervisión",
  "Instalación",
  "Inspección",
  "Consultoría",
  "Análisis de riesgo",
  "Plan de rescate",
  "Asesoría",
];

const RESPONSABLES = [
  "Ing. Karim Gómez",
  "Ing. Alejandro Rivera",
  "Ing. Mónica Trejo",
  "Ing. Pablo Estrada",
  "Ing. Diana Vega",
];

const STATUSES: ProjectStatus[] = ["completado", "completado", "completado", "en-curso", "pendiente", "revision"];

export const PROJECTS: Project[] = PLANTS.flatMap((p, i) => {
  const count = 2 + (i % 3);
  return Array.from({ length: count }, (_, k) => {
    const type = PROJECT_TYPES[(i + k) % PROJECT_TYPES.length];
    const year = 2024 + ((i + k) % 2);
    const month = String(1 + ((i * 3 + k * 5) % 12)).padStart(2, "0");
    const day = String(5 + ((i + k * 7) % 22)).padStart(2, "0");
    return {
      id: `prj-${p.slug}-${k + 1}`,
      name: `${type} — ${p.name}`,
      type,
      clientSlug: p.clientSlug,
      plantSlug: p.slug,
      fecha: `${year}-${month}-${day}`,
      responsable: RESPONSABLES[(i + k) % RESPONSABLES.length],
      status: STATUSES[(i + k) % STATUSES.length],
      descripcion: `Intervención técnica KG Safety: ${type.toLowerCase()} aplicada al sistema de seguridad en altura de ${p.name}. Incluye diagnóstico, ejecución y entrega documental.`,
    };
  });
});

// ============= CERTIFICACIONES =============
const today = new Date("2026-05-27");
function daysFromNow(d: number) {
  const x = new Date(today);
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
}

export const CERTIFICATIONS: Certification[] = SYSTEMS.map((s, i) => {
  // Distribución: 25% vencido, 25% <30d, 25% <60d, 25% vigente
  const bucket = i % 4;
  const venc = [-40, 15, 45, 180][bucket];
  return {
    id: `cert-${s.id}`,
    systemId: s.id,
    plantSlug: s.plantSlug,
    ultima: daysFromNow(venc - 365),
    vencimiento: daysFromNow(venc),
  };
});

export function certState(c: Certification): CertState {
  const dias = Math.floor((new Date(c.vencimiento).getTime() - today.getTime()) / 86400000);
  if (dias < 0) return "vencido";
  if (dias <= 30) return "por-vencer-30";
  if (dias <= 60) return "por-vencer-60";
  return "vigente";
}
export function daysLeft(c: Certification) {
  return Math.floor((new Date(c.vencimiento).getTime() - today.getTime()) / 86400000);
}

// ============= DOCUMENTOS =============
const DOC_TYPES: DocType[] = ["factura", "cotizacion", "orden-compra", "certificado", "ficha-tecnica", "reporte", "evidencia", "acta", "bitacora"];

export const DOCUMENTS: Document[] = PROJECTS.flatMap((p, i) => {
  const types = DOC_TYPES.slice(0, 4 + (i % 5));
  return types.map((t, k) => ({
    id: `doc-${p.id}-${t}`,
    type: t,
    name: `${labelDoc(t)} — ${p.name}`,
    projectId: p.id,
    plantSlug: p.plantSlug,
    fecha: p.fecha,
    size: `${100 + ((i + k) * 37) % 1800} KB`,
  }));
});

export function labelDoc(t: DocType): string {
  const m: Record<DocType, string> = {
    factura: "Factura",
    cotizacion: "Cotización",
    "orden-compra": "Orden de compra",
    certificado: "Certificado",
    "ficha-tecnica": "Ficha técnica",
    reporte: "Reporte técnico",
    evidencia: "Evidencia fotográfica",
    acta: "Acta de entrega",
    bitacora: "Bitácora de inspección",
  };
  return m[t];
}

// ============= FACTURAS =============
export const INVOICES: Invoice[] = PROJECTS.filter((_, i) => i % 2 === 0).map((p, i) => ({
  folio: `KGS-${2025 + (i % 2)}-${String(1000 + i).padStart(5, "0")}`,
  fecha: p.fecha,
  projectId: p.id,
  clientSlug: p.clientSlug,
  monto: 28000 + ((i * 13700) % 420000),
  status: (["pagada", "pagada", "pendiente", "vencida"] as const)[i % 4],
}));

// ============= BIBLIOTECA INTERNA =============
const LIB_CATEGORIES = [
  "Presentaciones comerciales",
  "Fichas técnicas",
  "Formatos de inspección",
  "Formatos de capacitación",
  "Reportes modelo",
  "Manuales de marca",
  "Certificaciones de marcas",
  "Normas",
  "Procedimientos",
  "Material de entrenamiento",
];

export const LIBRARY: LibraryDoc[] = LIB_CATEGORIES.flatMap((cat, i) =>
  Array.from({ length: 3 + (i % 3) }, (_, k) => ({
    id: `lib-${i}-${k}`,
    category: cat,
    name: `${cat} · documento ${k + 1}`,
    fecha: `2025-${String(1 + ((i + k) % 12)).padStart(2, "0")}-15`,
    size: `${200 + ((i + k) * 91) % 4000} KB`,
  })),
);

export const LIB_CATEGORIES_LIST = LIB_CATEGORIES;

// ============= HELPERS =============
export function clientBySlug(slug?: string) {
  return CLIENTS.find((c) => c.slug === slug);
}
export function plantBySlug(slug?: string) {
  return PLANTS.find((p) => p.slug === slug);
}
export function plantsByClient(clientSlug: string) {
  return PLANTS.filter((p) => p.clientSlug === clientSlug);
}
export function projectsByPlant(plantSlug: string) {
  return PROJECTS.filter((p) => p.plantSlug === plantSlug);
}
export function projectsByClient(clientSlug: string) {
  return PROJECTS.filter((p) => p.clientSlug === clientSlug);
}
export function systemsByPlant(plantSlug: string) {
  return SYSTEMS.filter((s) => s.plantSlug === plantSlug);
}
export function certsByPlant(plantSlug: string) {
  return CERTIFICATIONS.filter((c) => c.plantSlug === plantSlug);
}
export function docsByProject(projectId: string) {
  return DOCUMENTS.filter((d) => d.projectId === projectId);
}
export function projectById(id: string) {
  return PROJECTS.find((p) => p.id === id);
}
export function systemById(id: string) {
  return SYSTEMS.find((s) => s.id === id);
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "2-digit" });
}
export function fmtMoney(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
}

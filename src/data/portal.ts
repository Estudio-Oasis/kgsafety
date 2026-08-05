// Datos del Portal KG Safety.
// Las colecciones se hidratan en tiempo de ejecución desde la base de datos
// (con acceso restringido por empresa y rol vía RLS). Aquí sólo viven los
// tipos y los helpers de presentación.

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

export type Worker = {
  id: string;
  nombre: string;
  puesto: string;
  plantSlug: string;
  curso: string;
  dc3: string;
  emision: string;
  vencimiento: string;
  instructor: string;
};

export type ServiceRequest = {
  id: string;
  fecha: string;
  plantSlug: string;
  tipo: string;
  descripcion: string;
  status: "recibida" | "en-revision" | "cotizada" | "programada" | "cerrada";
  solicitante: string;
};

// ============= COLECCIONES (hidratadas desde la base de datos) =============
export let CLIENTS: Client[] = [];
export let PLANTS: Plant[] = [];
export let SYSTEMS: SystemInstalled[] = [];
export let PROJECTS: Project[] = [];
export let CERTIFICATIONS: Certification[] = [];
export let DOCUMENTS: Document[] = [];
export let WORKERS: Worker[] = [];
export let LIBRARY: LibraryDoc[] = [];
export let SERVICE_REQUESTS: ServiceRequest[] = [];
export let LIB_CATEGORIES_LIST: string[] = [];
// Sin información financiera en el portal.
export const INVOICES: Invoice[] = [];

export type PortalDataset = {
  clients: Client[];
  plants: Plant[];
  systems: SystemInstalled[];
  projects: Project[];
  certifications: Certification[];
  documents: Document[];
  workers: Worker[];
  library: LibraryDoc[];
  serviceRequests: ServiceRequest[];
};

export function hydratePortalData(d: PortalDataset) {
  CLIENTS = d.clients;
  PLANTS = d.plants;
  SYSTEMS = d.systems;
  PROJECTS = d.projects;
  CERTIFICATIONS = d.certifications;
  DOCUMENTS = d.documents;
  WORKERS = d.workers;
  LIBRARY = d.library;
  SERVICE_REQUESTS = d.serviceRequests;
  LIB_CATEGORIES_LIST = Array.from(new Set(d.library.map((l) => l.category)));
}

export function clearPortalData() {
  hydratePortalData({
    clients: [],
    plants: [],
    systems: [],
    projects: [],
    certifications: [],
    documents: [],
    workers: [],
    library: [],
    serviceRequests: [],
  });
}

// ============= VIGENCIAS =============
function todayMs() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function certState(c: Certification): CertState {
  const dias = Math.floor((new Date(c.vencimiento).getTime() - todayMs()) / 86400000);
  if (dias < 0) return "vencido";
  if (dias <= 30) return "por-vencer-30";
  if (dias <= 60) return "por-vencer-60";
  return "vigente";
}
export function daysLeft(c: Certification) {
  return Math.floor((new Date(c.vencimiento).getTime() - todayMs()) / 86400000);
}

export function dc3State(w: Worker): CertState {
  const dias = Math.floor((new Date(w.vencimiento).getTime() - todayMs()) / 86400000);
  if (dias < 0) return "vencido";
  if (dias <= 30) return "por-vencer-30";
  if (dias <= 60) return "por-vencer-60";
  return "vigente";
}

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
export function workersByPlant(plantSlug: string) {
  return WORKERS.filter((w) => w.plantSlug === plantSlug);
}
export function workersByClient(clientSlug: string) {
  const slugs = plantsByClient(clientSlug).map((p) => p.slug);
  return WORKERS.filter((w) => slugs.includes(w.plantSlug));
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "2-digit" });
}
export function fmtMoney(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
}

export function expiryLabel(c: Certification): string {
  const dl = daysLeft(c);
  if (dl < 0) {
    const n = Math.abs(dl);
    return `Vencida hace ${n} ${n === 1 ? "día" : "días"}`;
  }
  if (dl === 0) return "Vence hoy";
  return `Vence en ${dl} ${dl === 1 ? "día" : "días"}`;
}

// ============= METADATOS DERIVADOS =============
const KG_TEAM = [
  "Ing. Karim Gómez",
  "Ing. Alejandro Rivera",
  "Ing. Mónica Trejo",
  "Ing. Pablo Estrada",
  "Ing. Diana Vega",
];

export function responsableKGForPlant(plantSlug: string): string {
  const i = PLANTS.findIndex((p) => p.slug === plantSlug);
  return KG_TEAM[Math.max(0, i) % KG_TEAM.length];
}

export function ultimaActualizacionPlant(plantSlug: string): string {
  const ps = projectsByPlant(plantSlug)
    .slice()
    .sort((a, b) => b.fecha.localeCompare(a.fecha));
  return ps[0]?.fecha ?? new Date().toISOString().slice(0, 10);
}

export function ultimaActualizacionProject(p: Project): string {
  const d = new Date(p.fecha);
  d.setDate(d.getDate() + 5);
  return d.toISOString().slice(0, 10);
}

export type NextExpiry = { label: string; fecha: string; state: CertState } | null;

export function nextExpiryForPlant(plantSlug: string): NextExpiry {
  const certs = certsByPlant(plantSlug)
    .slice()
    .sort((a, b) => a.vencimiento.localeCompare(b.vencimiento));
  if (!certs.length) return null;
  const vencida = certs.find((c) => certState(c) === "vencido");
  const c = vencida ?? certs[0];
  const sys = systemById(c.systemId);
  return { label: sys?.type ?? "Sistema instalado", fecha: c.vencimiento, state: certState(c) };
}

// ============= HISTORIAL (TIMELINE) DEL PROYECTO =============
export type ProjectEvent = { fecha: string; label: string; desc: string };

export function buildProjectTimeline(p: Project): ProjectEvent[] {
  const base = new Date(p.fecha);
  const offset = (n: number) => {
    const d = new Date(base);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  return [
    {
      fecha: offset(-21),
      label: "Cotización enviada",
      desc: `Propuesta técnica enviada al cliente para ${p.type.toLowerCase()}.`,
    },
    {
      fecha: offset(-12),
      label: "Orden de compra recibida",
      desc: "Cliente confirma OC y se programa intervención en sitio.",
    },
    {
      fecha: offset(0),
      label: "Servicio ejecutado",
      desc: `${p.responsable} y cuadrilla KG Safety ejecutan trabajo en planta.`,
    },
    {
      fecha: offset(2),
      label: "Documentos cargados",
      desc: "Evidencia fotográfica, bitácora y acta de entrega disponibles en el portal.",
    },
    {
      fecha: offset(5),
      label: "Certificado emitido",
      desc: "Certificado de cumplimiento firmado y disponible para descarga.",
    },
  ];
}

// ============= CALENDARIO DE CUMPLIMIENTO =============
export type ComplianceEvent = {
  id: string;
  fecha: string;
  tipo: "recertificacion" | "inspeccion" | "capacitacion" | "auditoria";
  titulo: string;
  plantSlug: string;
  responsable: string;
};

export function complianceEventsForPlants(plantSlugs: string[]): ComplianceEvent[] {
  const events: ComplianceEvent[] = [];
  CERTIFICATIONS.filter((c) => plantSlugs.includes(c.plantSlug)).forEach((c) => {
    const sys = systemById(c.systemId);
    events.push({
      id: `ev-cert-${c.id}`,
      fecha: c.vencimiento,
      tipo: "recertificacion",
      titulo: `Recertificación · ${sys?.type ?? "Sistema"}`,
      plantSlug: c.plantSlug,
      responsable: responsableKGForPlant(c.plantSlug),
    });
  });
  WORKERS.filter((w) => plantSlugs.includes(w.plantSlug)).forEach((w) => {
    events.push({
      id: `ev-dc3-${w.id}`,
      fecha: w.vencimiento,
      tipo: "capacitacion",
      titulo: `Recapacitación · ${w.nombre}`,
      plantSlug: w.plantSlug,
      responsable: w.instructor,
    });
  });
  const year = new Date().getFullYear();
  plantSlugs.forEach((slug, i) => {
    for (let q = 0; q < 4; q++) {
      const month = String(1 + q * 3 + (i % 2)).padStart(2, "0");
      events.push({
        id: `ev-insp-${slug}-${q}`,
        fecha: `${year + 1}-${month}-15`,
        tipo: "inspeccion",
        titulo: "Inspección visual programada",
        plantSlug: slug,
        responsable: responsableKGForPlant(slug),
      });
    }
  });
  return events.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

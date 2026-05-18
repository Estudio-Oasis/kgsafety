// Translation dictionary. Spanish keys → English values.
// useT() returns the EN string when lang === "en", otherwise the key itself (ES).
// Add new entries here as components add strings.

export type Lang = "es" | "en";

export const en: Record<string, string> = {
  // ─── Header / Nav ────────────────────────────────────────────
  Inicio: "Home",
  Equipos: "Equipment",
  Capacitación: "Training",
  Ingeniería: "Engineering",
  Nosotros: "About",
  Contacto: "Contact",
  "P.N.P.C.": "P.N.P.C.",
  Blog: "Blog",
  "Cotizar ahora": "Request a quote",
  "Abrir menú": "Open menu",

  // ─── Footer ──────────────────────────────────────────────────
  Servicios: "Services",
  "Capacitación DC-3": "DC-3 Training",
  "Líneas de Vida": "Lifelines",
  "Equipos certificados": "Certified equipment",
  "Ingeniería aplicada a la eliminación total de riesgos de caída. Soluciones integrales para empresas Clase Mundial en México.":
    "Engineering applied to the total elimination of fall risks. Integral solutions for World-Class companies in Mexico.",
  "Lun a Vie · 9:00 – 18:00": "Mon–Fri · 9:00 – 18:00",
  "© 2025 KG Fall Protection Engineering · Toluca · Querétaro · CDMX":
    "© 2025 KG Fall Protection Engineering · Toluca · Querétaro · CDMX",
  "Contactar por WhatsApp": "Contact via WhatsApp",
  "Cambiar tema": "Toggle theme",
  "Cambiar idioma": "Toggle language",

  // ─── Home / Index ────────────────────────────────────────────
  "Líder en ingeniería de alturas": "Leader in height engineering",
  "WE NEVER": "WE NEVER",
  "FALL.": "FALL.",
  "Soluciones integrales en seguridad industrial para empresas Clase Mundial. Ingeniería aplicada a la eliminación total de riesgos de caída.":
    "Integral industrial safety solutions for World-Class companies. Engineering applied to the total elimination of fall risks.",
  "Líneas de vida": "Lifelines",
  "Horas-hombre supervisadas": "Supervised man-hours",
  "sin accidentes reportados": "with zero reported accidents",
  "Confiado por líderes de la industria": "Trusted by industry leaders",
  "Trabajadores capacitados": "Workers trained",
  "Cursos impartidos": "Courses delivered",
  "Clientes corporativos": "Corporate clients",
  "División técnica": "Technical division",
  "Cinco frentes contra": "Five fronts against",
  "la": "",
  "gravedad": "gravity",
  ".": ".",
  "Cada servicio diseñado para convertir riesgo crítico en operación controlada.":
    "Every service designed to turn critical risk into controlled operations.",
  "Tres niveles certificados: básico 8 h, supervisor 16 h y jefe de seguridad 24 h. Cobertura nacional.":
    "Three certified levels: basic 8 h, supervisor 16 h and safety chief 24 h. Nationwide coverage.",
  "Ver niveles": "See levels",
  "Líneas de Vida e Ingeniería": "Lifelines & Engineering",
  "Diseño, fabricación e instalación de sistemas verticales y horizontales bajo NOM-009-STPS.":
    "Design, fabrication and installation of vertical and horizontal systems under NOM-009-STPS.",
  "Solicitar diagnóstico": "Request diagnosis",
  "EPP, anclajes, malacates y rescatadores con marcas líderes. Venta, renta y certificación.":
    "PPE, anchors, hoists and rescuers from leading brands. Sale, rental and certification.",
  "Ver catálogo": "See catalog",
  "Supervisión en sitio": "On-site supervision",
  "Monitoreo profesional para trabajos de alto riesgo, auditorías y emisión de certificados.":
    "Professional monitoring for high-risk work, audits and certificate issuance.",
  "Agendar visita": "Schedule visit",
  "P.N.P.C. Contratistas": "P.N.P.C. Contractors",
  "Estandariza la seguridad de tus proveedores externos con el programa nacional.":
    "Standardize the safety of your external suppliers with the national program.",
  "Conocer programa": "Learn about the program",
  "Método propietario": "Proprietary method",
  "El método": "The",
  "method": "method",
  "Metodología registrada que reduce a cero los accidentes en trabajos en altura bajo implementación del programa completo.":
    "Registered methodology that reduces fall accidents to zero under full program implementation.",
  "Conoce el método →": "Learn the method →",
  "Transferencia de conocimiento técnico normativo nacional e internacional.":
    "Transfer of technical knowledge — national and international standards.",
  "Evaluación exhaustiva de riesgos específicos en sitio con equipo certificado.":
    "Thorough evaluation of site-specific risks with certified equipment.",
  "Diseño y fabricación a medida de sistemas de anclaje y líneas de vida.":
    "Custom design and fabrication of anchor systems and lifelines.",
  "Implementación final para la eliminación total del riesgo de caída.":
    "Final implementation for the total elimination of fall risk.",
  "La rigurosidad técnica de KG Safety transformó nuestra cultura operativa. No solo instalaron equipos: instalaron tranquilidad en procesos de alto riesgo.":
    "KG Safety's technical rigor transformed our operational culture. They didn't just install equipment — they installed peace of mind in high-risk processes.",
  "Grupo IOCISA — Cliente Industrial": "Grupo IOCISA — Industrial Client",
  "Programa Nacional de Profesionalización a Contratistas":
    "National Contractor Professionalization Program",
  "Estandarice la seguridad de sus proveedores externos bajo los protocolos más estrictos de KG Safety.":
    "Standardize external supplier safety under KG Safety's strictest protocols.",
  "Solicitar auditoría P.N.P.C.": "Request P.N.P.C. audit",
  "Certificados y alineados:": "Certified and aligned:",
  "Cotice su proyecto en": "Quote your project in",
  "menos de 24 horas": "less than 24 hours",
  "Comparta su necesidad: equipo, capacitación o ingeniería. Un especialista lo contactará el mismo día.":
    "Share your need — equipment, training or engineering. A specialist contacts you the same day.",
  "Solicitar cotización": "Request quote",
  "WhatsApp directo": "Direct WhatsApp",

  // ─── Capacitación ───────────────────────────────────────────
  "Capacitación certificada": "Certified training",
  "DC-3, certificado y": "DC-3, certificate and",
  "credencial": "credential",
  "oficial.": "official.",
  "Tres niveles · doce áreas · capacitadores certificados por KAEE Group FPCS, STPS, OSHA y NSC. Cobertura nacional con programas de recertificación anualizada.":
    "Three levels · twelve areas · instructors certified by KAEE Group FPCS, STPS, OSHA and NSC. Nationwide coverage with annual recertification programs.",
  "Inscribir grupo": "Enroll a group",
  "Niveles": "Levels",
  "Tres niveles de mando": "Three command levels",
  "8 horas": "8 hours",
  "16 horas": "16 hours",
  "24 horas": "24 hours",
  "Básico / Autorizado": "Basic / Authorized",
  "Supervisor / Monitor": "Supervisor / Monitor",
  "Jefe de Seguridad / Competente": "Safety Chief / Competent",
  "El participante conocerá los elementos básicos de seguridad para el uso de los equipos y la ejecución segura de sus labores.":
    "The participant will learn the basic safety elements for equipment use and the safe execution of their tasks.",
  "Capacita en supervisión de trabajadores, evaluación de condiciones de seguridad y maniobras de rescate.":
    "Training in worker supervision, safety condition evaluation and rescue maneuvers.",
  "Cubre normativas nacionales e internacionales, diseño de anclajes, planes de trabajo y capacidad para impartir cursos internos.":
    "Covers national and international standards, anchor design, work plans and the ability to deliver internal courses.",
  "DC-3 oficial": "Official DC-3",
  "Certificado de cumplimiento": "Compliance certificate",
  "Credencial con candados anti-falsificación": "Credential with anti-forgery locks",
  "Certificado": "Certificate",
  "Credencial profesional": "Professional credential",
  "Certificado Competent Person": "Competent Person certificate",
  "Diseño de anclajes": "Anchor design",
  "Inscribir →": "Enroll →",
  "12 áreas": "12 areas",
  "Cursos": "Courses",
  "disponibles": "available",
  "Temarios homologados, instructores certificados y emisión documental con certeza jurídica. Registro de CURP y verificación en línea.":
    "Standardized syllabi, certified instructors and document issuance with legal certainty. CURP registration and online verification.",
  "Alturas": "Heights",
  "Espacios Confinados": "Confined Spaces",
  "Andamios": "Scaffolding",
  "LOTO": "LOTO",
  "Electricidad": "Electrical",
  "Trabajos con Calor": "Hot Work",
  "Manejo de Herramientas": "Tool Handling",
  "Primeros Auxilios": "First Aid",
  "Manejo de Extintores": "Fire Extinguishers",
  "Montacargas": "Forklifts",
  "OSHA 10 horas": "OSHA 10 hours",
  "OSHA 30 horas": "OSHA 30 hours",
  "Certeza jurídica": "Legal certainty",
  "Cero margen para la falsificación.": "Zero room for forgery.",
  "Registro de trabajadores y empresas en base de datos.":
    "Worker and company database registration.",
  "Seguimiento directo de CURP.": "Direct CURP tracking.",
  "Registro de asistencia y aprobación del curso.": "Attendance and course-approval log.",
  "DC-3 emitido y verificable en línea.": "DC-3 issued and verifiable online.",
  "Credencial con múltiples candados anti-falsificación.":
    "Credential with multiple anti-forgery locks.",
  "Certificado de cumplimiento para identidad corporativa.":
    "Compliance certificate for corporate identity.",
  "Inscriba a su equipo": "Enroll your team",
  "esta semana": "this week",
  "Programación a nivel nacional. Modalidad presencial e instructores certificados.":
    "Nationwide scheduling. On-site format with certified instructors.",
  "Solicitar fechas": "Request dates",
  "OSHA Subpartes — guion básico": "OSHA Subparts — base curriculum",
  "Los temarios siguen como guion las Subpartes OSHA 1926 y 1910, homologados con la NOM-009-STPS-2011 y adaptados al estándar interno de cada cliente.":
    "Syllabi follow OSHA Subparts 1926 and 1910 as the base curriculum, harmonized with NOM-009-STPS-2011 and adapted to each client's internal standard.",
  "Recertificación y rotación de personal": "Recertification & staff rotation",
  "Programas anualizados, control de vencimientos y apoyo en rotación de personal para mantener al 100% al equipo operativo certificado.":
    "Annual programs, expiry control and support for staff rotation to keep operating teams 100% certified.",

  // ─── Contratistas ───────────────────────────────────────────
  "Programa Nacional de": "National",
  "Profesionalización": "Professionalization",
  "a Contratistas.": "for Contractors.",
  "10 años de implementación ininterrumpida en empresas multinacionales. Reducción a cero de accidentes en trabajos en altura bajo programa completo.":
    "10 years of uninterrupted implementation in multinational companies. Zero fall accidents under the complete program.",
  "Beneficios": "Benefits",
  "Operación bajo": "Operation under",
  "control total.": "total control.",
  "El P.N.P.C. permite controlar a los contratistas en los tres niveles de capacitación y al personal interno para una comunicación correcta entre ambas partes.":
    "P.N.P.C. lets you control contractors across the three training levels and align internal staff for proper bilateral communication.",
  "Auditable por STPS,": "Auditable by STPS,",
  "REPSE y clientes": "REPSE and clients",
  "Control y registro de contratistas en tres niveles de capacitación.":
    "Contractor control and registry across three training levels.",
  "Reglas de operación claras dentro de cada planta.":
    "Clear operating rules within each plant.",
  "Acceso a base de datos nacional de contratistas inscritos.":
    "Access to a national database of registered contractors.",
  "Renta de sistemas de anclaje especializados para trabajos de baja frecuencia.":
    "Rental of specialized anchor systems for low-frequency work.",
  "Reducción de tiempos muertos previo a AST y EPP.":
    "Reduced downtime before JSA and PPE setup.",
  "Auditoría completa por STPS, REPSE y clientes.":
    "Full audit by STPS, REPSE and clients.",
  "Problemáticas que resolvemos": "Problems we solve",
  "Causas raíz que": "Root causes we",
  "eliminamos": "eliminate",
  "Mercado negro de supervisores.": "Black market for supervisors.",
  "Falta de temarios de capacitación homologados.":
    "Lack of standardized training syllabi.",
  "Retrasos por falta de profesionalismo del contratista.":
    "Delays due to lack of contractor professionalism.",
  "Criterios divididos para toma de decisiones.":
    "Divided criteria for decision making.",
  "Desconocimiento de nuevos equipos y marcas.":
    "Lack of awareness of new equipment and brands.",
  "Planeación tardía vs procedimientos de la empresa.":
    "Late planning vs company procedures.",
  "Instituto": "Institute",
  "Instituto Nacional de Capacitación en Seguridad Laboral KG":
    "KG National Institute for Occupational Safety Training",
  "Información clara, accesible y en tiempo real para todos los involucrados: seguridad, mantenimiento, abastecimiento, servicio médico y contratistas alineados bajo un solo estándar.":
    "Clear, accessible real-time information for all stakeholders: safety, maintenance, procurement, medical service and contractors aligned to a single standard.",
  "Active el P.N.P.C. en su planta.": "Activate P.N.P.C. in your plant.",
  "Solicite una auditoría inicial sin compromiso.":
    "Request a no-commitment initial audit.",
  "Solicitar auditoría": "Request audit",
  "Antecedentes": "Background",
  "Una década midiendo cero": "A decade measuring zero",
  "10 años de implementación. Reducción a cero de accidentes en trabajos en alturas bajo programa completo. 100% auditable por STPS, REPSE y clientes. Información clara y accesible en tiempo real.":
    "10 years of implementation. Zero fall accidents under full program. 100% auditable by STPS, REPSE and clients. Clear, accessible information in real time.",
  "Áreas y entrenamiento P.N.P.C.": "P.N.P.C. areas & training",
  "3 áreas de capacitación + 2 de entrenamiento":
    "3 training areas + 2 hands-on training tracks",
  "Persona autorizada · Monitor de seguridad · Persona competente. Más entrenamiento en rescate y uso de anclajes temporales.":
    "Authorized person · Safety monitor · Competent person. Plus training in rescue and temporary anchor use.",

  // ─── Ingeniería ─────────────────────────────────────────────
  "Ingeniería aplicada": "Applied engineering",
  "Sistemas de anclaje": "Anchor systems",
  "diseñados": "designed",
  "a medida.": "to measure.",
  "Líneas de vida, anclajes, plataformas y estructuras de obra civil. Ingeniería certificada para cada estructura, cada persona, cada detalle.":
    "Lifelines, anchors, platforms and civil-works structures. Certified engineering for every structure, every person, every detail.",
  "Agendar diagnóstico": "Schedule diagnosis",
  "Catálogo de soluciones": "Solution catalog",
  "Seis frentes técnicos": "Six technical fronts",
  "Líneas de Vida Verticales": "Vertical Lifelines",
  "Sistemas LVV con cable y rigid rail para escaleras, torres y silos.":
    "LVV systems with cable and rigid rail for ladders, towers and silos.",
  "Líneas de Vida Horizontales": "Horizontal Lifelines",
  "Sistemas LVH overhead y a nivel: structural, rigid rail y cable base.":
    "LVH overhead and at-level systems: structural, rigid rail and cable base.",
  "Anclajes": "Anchors",
  "Móviles, portátiles, temporales, removibles, individuales o colectivos. Compra o renta.":
    "Mobile, portable, temporary, removable, individual or collective. Purchase or rental.",
  "Hand Rails": "Hand Rails",
  "Barandales fijos y removibles para acceso seguro a zonas perimetrales.":
    "Fixed and removable handrails for safe access to perimeter zones.",
  "Plataformas y estructuras": "Platforms & structures",
  "Plataformas elevadoras y obra civil a medida con departamento propio.":
    "Lifting platforms and custom civil works with in-house department.",
  "Supervisión y certificación": "Supervision & certification",
  "Auditorías, pruebas de carga y verificación periódica de sistemas.":
    "Audits, load tests and periodic system verification.",
  "Proceso": "Process",
  "De diagnóstico a": "From diagnosis to",
  "entrega certificada": "certified delivery",
  "Diagnóstico en sitio": "On-site diagnosis",
  "Visita técnica con ingeniero certificado.":
    "Technical visit with a certified engineer.",
  "Propuesta de ingeniería": "Engineering proposal",
  "Diseño bajo NOM-009-STPS, OSHA, ANSI y EN-795.":
    "Design under NOM-009-STPS, OSHA, ANSI and EN-795.",
  "Fabricación": "Fabrication",
  "Manufactura controlada con materiales certificados.":
    "Controlled manufacturing with certified materials.",
  "Montaje e instalación": "Assembly & installation",
  "Instaladores certificados con cobertura nacional.":
    "Certified installers with nationwide coverage.",
  "Certificación y entrega": "Certification & delivery",
  "Pruebas de carga, documentación y plan de mantenimiento.":
    "Load testing, documentation and maintenance plan.",
  "Cada estructura": "Every structure",
  "merece": "deserves",
  "un anclaje propio.": "its own anchor.",
  "Pida una visita técnica sin costo. Nuestros ingenieros responden el mismo día.":
    "Request a no-cost technical visit. Our engineers respond the same day.",
  "Solicitar visita técnica": "Request technical visit",
  "Construcción y mantenimiento": "Construction & maintenance",
  "Programas residenciales e industriales": "Residential & industrial programs",
  "Mantenimientos puntuales, programas preventivos y correctivos a corto, mediano y largo plazo. Limpieza, pintura, electricidad, impermeabilización y obra civil.":
    "On-demand maintenance, preventive and corrective programs short-, mid- and long-term. Cleaning, paint, electrical, waterproofing and civil works.",
  "Programa a 3 años": "3-year program",
  "Al término del programa el cliente es propietario de los elementos sin costo extra.":
    "At the end of the program the client owns the equipment at no extra cost.",

  // ─── Equipos ────────────────────────────────────────────────
  "Catálogo de equipos": "Equipment catalog",
  "Equipos certificados,": "Certified equipment,",
  "trazables": "traceable",
  ", garantizados.": ", guaranteed.",
  "Más de 30 marcas de representación. Asesoría en selección, fichas técnicas y cotización inmediata para venta, renta y certificación.":
    "Over 30 represented brands. Selection advisory, datasheets and instant quotes for sale, rental and certification.",
  "Solicitar catálogo PDF": "Request PDF catalog",
  "Categorías": "Categories",
  "12 líneas de producto": "12 product lines",
  "Arneses y EPP": "Harnesses & PPE",
  "Equipo de protección personal certificado ANSI / OSHA.":
    "Personal protective equipment certified to ANSI / OSHA.",
  "Fijos, móviles, temporales, individuales y colectivos.":
    "Fixed, mobile, temporary, individual and collective.",
  "Malacates manuales": "Manual hoists",
  "Para elevación y manejo controlado de cargas.":
    "For controlled lifting and load handling.",
  "Malacates eléctricos": "Electric hoists",
  "Operación industrial de alto ciclo.": "High-duty industrial operation.",
  "Cuerdas y cables": "Ropes & cables",
  "Líneas de seguridad de acero y sintéticas.":
    "Steel and synthetic safety lines.",
  "Ganchos, poleas, grilletes": "Hooks, pulleys, shackles",
  "Hardware certificado con trazabilidad.":
    "Certified hardware with traceability.",
  "Anclajes de suelo": "Floor anchors",
  "Bases removibles y soluciones permanentes.":
    "Removable bases and permanent solutions.",
  "Abrazaderas y troles": "Clamps & trolleys",
  "Sistemas de fijación y desplazamiento.":
    "Fixing and traversing systems.",
  "Descensores de emergencia": "Emergency descenders",
  "Equipos auto-rescatadores certificados.":
    "Certified self-rescue equipment.",
  "Rescatadores de E.C.": "C.S. rescuers",
  "Equipo especializado para espacios confinados.":
    "Specialized equipment for confined spaces.",
  "Sistemas removibles": "Removable systems",
  "Soluciones temporales para baja frecuencia.":
    "Temporary solutions for low-frequency work.",
  "Plataformas elevadoras": "Lifting platforms",
  "Acceso seguro a altura controlada.":
    "Safe access at controlled height.",
  "Más de 30 marcas representadas": "Over 30 represented brands",
  "¿Sabe qué equipo necesita?": "Know which equipment you need?",
  "¿O necesita asesoría?": "Need advice?",
  "Compártanos su proyecto y un ingeniero le arma una propuesta puntual.":
    "Share your project and an engineer puts together a precise proposal.",
  "Cotizar equipos": "Quote equipment",

  // ─── Nosotros ───────────────────────────────────────────────
  "Quiénes somos": "Who we are",
  "No solo diseñamos seguridad.": "We don't just design safety.",
  "Diseñamos tranquilidad.": "We design peace of mind.",
  "En KG nos especializamos en el diseño e implementación de sistemas de protección contra caídas que cumplen con los más altos estándares de ingeniería y seguridad. Cada estructura, cada persona y cada detalle importan.":
    "At KG we specialize in the design and implementation of fall-protection systems that meet the highest engineering and safety standards. Every structure, every person and every detail matter.",
  "Método registrado": "Registered method",
  "Método": "Method",
  "Cuatro etapas críticas de ingeniería aplicada. La metodología propietaria que reduce a cero los accidentes bajo implementación completa.":
    "Four critical stages of applied engineering. The proprietary methodology that reduces accidents to zero under full implementation.",
  "Conocimiento bilateral para entendimiento claro entre cliente y equipo técnico.":
    "Bilateral knowledge for clear understanding between client and technical team.",
  "Análisis en común con el cliente para lograr comunicación y objetivos definidos.":
    "Joint analysis with the client to achieve communication and defined goals.",
  "Aplicación de cualquier método de ingeniería necesario para lograr los objetivos.":
    "Application of any engineering method required to achieve the goals.",
  "Eliminación total de la problemática buscando el 100%.":
    "Total elimination of the problem, aiming for 100%.",
  "Valores": "Values",
  "Lo que nos hace innegociables.": "What makes us non-negotiable.",
  "Seguridad": "Safety",
  "Sobre todo otro valor operativo.": "Above any other operating value.",
  "Integridad": "Integrity",
  "Documentación, normativa y cumplimiento sin excepción.":
    "Documentation, regulation and compliance without exception.",
  "Decisiones basadas en cálculo, no en suposición.":
    "Decisions based on calculation, not assumption.",
  "Servicio": "Service",
  "Respuesta del mismo día, ejecución sin pretextos.":
    "Same-day response, execution without excuses.",
  "Innovación": "Innovation",
  "Nuevos equipos, métodos y marcas evaluados continuamente.":
    "New equipment, methods and brands continuously evaluated.",
  "Legalidad": "Legality",
  "Certeza jurídica plena en cada documento emitido.":
    "Full legal certainty in every document issued.",
  "Normatividad y reglamentación": "Standards & regulation",
  "Alineados con los más altos estándares.":
    "Aligned with the highest standards.",
  "Reglamentos internos por cliente": "Internal regulations per client",
  "We never fall.": "We never fall.",
  "Trabajemos juntos": "Let's work together",
  "Comunicación efectiva en seguridad": "Effective safety communication",
  "Nueve pilares operativos": "Nine operating pillars",
  "Aseguramos comunicación, comprensión, detección de causa raíz, evaluación contra estándar, validación de proveedores, certificación de personal, flujo previo a trabajos en altura y capacitación continua.":
    "We ensure communication, comprehension, root-cause detection, evaluation against standard, supplier validation, personnel certification, pre-work flow for height work and continuous training.",
  "Submarcas KAEE Group": "KAEE Group sub-brands",

  // ─── Contacto ───────────────────────────────────────────────
  "Cotización en 24 horas": "Quote in 24 hours",
  "Cuéntenos su proyecto.": "Tell us about your project.",
  "Respondemos hoy.": "We answer today.",
  "Comparta detalles de equipos, capacitación o ingeniería. Un especialista lo contacta el mismo día hábil.":
    "Share details about equipment, training or engineering. A specialist contacts you the same business day.",
  "Nombre": "Name",
  "Empresa": "Company",
  "Razón social": "Legal name",
  "Email corporativo": "Corporate email",
  "Teléfono": "Phone",
  "Interés": "Interest",
  "Cotización general": "General quote",
  "Líneas de vida e ingeniería": "Lifelines & engineering",
  "Equipos y EPP": "Equipment & PPE",
  "Mensaje / proyecto": "Message / project",
  "Describa su necesidad, número de participantes o características del sitio.":
    "Describe your need, number of participants or site characteristics.",
  "Enviar por WhatsApp": "Send via WhatsApp",
  "También puede escribirnos a ventas@kg-safety.com":
    "You can also email us at ventas@kg-safety.com",
  "Teléfono y WhatsApp": "Phone & WhatsApp",
  "Correo": "Email",
  "Oficina": "Office",
  "Horario": "Hours",
  "Lunes a Viernes · 9:00 – 18:00 hrs": "Monday to Friday · 9:00 – 18:00 hrs",
  "Atención inmediata": "Immediate assistance",
  "Abrir WhatsApp": "Open WhatsApp",

  // ─── Blog ───────────────────────────────────────────────────
  "Blog y recursos": "Blog & resources",
  "Recursos técnicos para": "Technical resources for",
  "líderes de seguridad.": "safety leaders.",
  "Artículos, guías normativas y análisis de casos para profesionales de seguridad industrial.":
    "Articles, regulatory guides and case analyses for industrial safety professionals.",
  "Artículos recientes": "Recent articles",
  "Leer artículo →": "Read article →",
  "Próximamente": "Coming soon",
  "Más contenido en camino. Suscríbase con su correo corporativo.":
    "More content on the way. Subscribe with your corporate email.",

  // ─── 404 ────────────────────────────────────────────────────
  "Página no encontrada": "Page not found",
  "La página que buscas no existe o fue movida.":
    "The page you're looking for doesn't exist or was moved.",
  "Volver al inicio": "Back to home",
  "Algo falló": "Something failed",
  "Intenta recargar la página.": "Try reloading the page.",
  "Reintentar": "Retry",
};

export function translate(lang: Lang, key: string): string {
  if (lang === "en") return en[key] ?? key;
  return key;
}

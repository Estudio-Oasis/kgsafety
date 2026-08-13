# Cotejo del checklist ERP vs. lo que ya existe

Verificado hoy contra la base y el código (conteos reales de tablas, rutas del portal, funciones de servidor).

## Resumen honesto

Hoy tenemos **el esqueleto de datos y la lectura**, no la operación. La base ya contiene el histórico de Noil (371 clientes, 42 cursos, 27 cotizaciones con 29 partidas, 20 solicitudes, 8 órdenes, 5 sesiones, 7 participantes con 8 inscripciones, 8 asistencias/evaluaciones, 8 DC-3, 4 viáticos, 51 proveedores, 10 contratistas, 13 clasificaciones, 15 grupos, 8 servicios, 7 instructores, 3 agentes). Pero en el portal esa información **sólo se consulta**: no hay pantallas para crear/editar cotizaciones, órdenes, sesiones, asistencia, DC-3 ni facturas propias. Faltan además almacenamiento privado de archivos (0 buckets, 0 adjuntos), bitácora de auditoría poblada (audit_log = 0), calendario propio (calendar_events = 0), perfiles fiscales (0), facturas propias (0) y todo el módulo de inventario/almacén.

## Estado por sección

| # | Sección | Estado | Qué falta |
|---|---|---|---|
| 1 | Objetivo / flujo end-to-end | Parcial | Sólo tramo público → lead → Noil. El resto no se puede operar en la plataforma |
| 2 | Seguridad y administración | Parcial | Roles actuales: admin_kg, equipo_kg, cliente_corp, cliente_planta. Faltan Ventas, Operaciones, Instructor, Facturación, Sólo lectura; organization_members está vacío; falta config de empresa, series/folios, rate limit de login |
| 3 | Clientes | Parcial | Datos completos y RLS listos; falta CRUD, contactos, historiales por cliente, exportación, bitácora |
| 4 | Perfiles fiscales | Pendiente | Tabla existe, 0 registros, sin UI ni validación SAT |
| 5 | Contratistas | Parcial | 10 cargados; falta CRUD, relaciones y exportación |
| 6 | Proveedores | Parcial | 51 cargados; falta CRUD, documentos, historial |
| 7 | Catálogo de capacitación | Parcial | Clasificaciones/grupos/cursos/servicios cargados; faltan claves SAT, capacidad, impuestos, historial y vigencia de precios, temario |
| 7b | Productos / almacén | Pendiente | No existe módulo de inventario (SKU, existencias, series, movimientos). No venía en lo recuperado |
| 8 | Instructores y agentes | Parcial | Cargados; faltan acreditaciones con vigencia, disponibilidad, cursos autorizados en UI |
| 9 | Solicitud pública | Parcial | Formulario, folio en servidor, cola con reintentos y bitácora ya funcionan; faltan versión de aviso de privacidad, anti-bot, rate limiting, consulta segura de estatus, estados formales |
| 10 | Cotizaciones | Parcial (sólo lectura) | Faltan editor de partidas, cálculo en servidor, autorización, revisiones, PDF, envío, aceptación/rechazo, vencimiento automático |
| 11 | Órdenes de servicio | Parcial (sólo lectura) | Faltan creación desde cotización, folios, PDF, auditoría de cambios |
| 12 | Calendario y planeación | Pendiente | calendar_events vacío; hoy el calendario viene de Noil. Faltan vistas y validaciones de conflicto |
| 13 | Ejecución de cursos | Parcial | 5 sesiones históricas; sin pantalla de ejecución, evidencias ni reporte |
| 14 | Participantes e inscripciones | Parcial | Modelo correcto (persona ≠ inscripción); falta alta/edición y deduplicación por CURP en UI |
| 15 | Asistencia y evaluaciones | Parcial | Datos históricos presentes; falta captura, lista descargable, mínimo aprobatorio configurable |
| 16 | DC-3 | Parcial | 8 registros; falta elegibilidad, plantilla, PDF, hash, masivo, corrección/revocación |
| 17 | Viáticos | Parcial | 4 registros; falta captura, comprobantes, flujo de aprobación |
| 18 | Documentos y evidencias | Pendiente | No hay bucket privado ni URLs firmadas ni hash |
| 19 | Facturación | Parcial | Flujo vía Noil (backend, con preview PDF) funciona; facturas propias = 0, sin PAC propio, CSD, XML/PDF guardados, cancelaciones ni complementos |
| 20 | Portal del cliente | Parcial | Login y separación por empresa listos; falta aceptar/rechazar cotización, OC, autofactura, descargas DC-3/XML |
| 21 | Comunicaciones | Pendiente | No hay envío de correos ni plantillas ni historial |
| 22 | Dashboard | Parcial | Hay monitoreo de ERP y embudo comercial con IA; faltan casi todos los indicadores operativos |
| 23 | Reportes y exportaciones | Pendiente | Sin CSV/Excel/PDF ni filtros |
| 24 | Auditoría | Parcial | audit_log existe pero vacío y sin triggers; sí hay trazabilidad de llamadas a ERP/facturación en /portal/auditoria |
| 25 | Estabilidad | Parcial | Reintentos, outbox, alertas y trazas listos; faltan colas de correo/PDF, staging, rollback probado, rate limiting general |
| 26 | Migración histórica | Parcial | legacy_id y source_payload conservados, 1 lote de importación; falta reporte de conciliación y reejecución probada |
| 27 | Excepciones históricas | Pendiente | Detectadas pero sin bandeja de conciliación en el portal |
| 28 | Información no recuperada | Informativo | Usuarios/roles originales, XML/PDF fiscales, acuses, CSD y almacén se deben pedir al proveedor o contabilidad |
| 29 | Criterio final | No cumplido | El recorrido completo aún no se puede hacer sin Noil |

## Ruta propuesta para cerrar la brecha

Fase A — Bandeja de conciliación y auditoría real: pantalla de excepciones (folios duplicados, solicitudes sin cliente, cotizaciones sin solicitud/partidas, cantidades en cero, clientes sin RFC, persona repetida) y triggers que llenen audit_log.

Fase B — Roles y permisos operativos: agregar Ventas, Operaciones, Instructor, Facturación y Sólo lectura sobre organization_members, con RLS y revalidación en servidor.

Fase C — Catálogos administrables: CRUD de clientes, contratistas, proveedores, cursos (con claves SAT, capacidad, historial de precios), servicios, instructores y agentes, más exportación CSV.

Fase D — Ciclo comercial propio: solicitud → cotización con partidas y cálculo en servidor → autorización y revisiones → PDF y envío → aceptación → orden de servicio con folio propio.

Fase E — Operación: calendario propio con validación de conflictos, sesiones, inscripciones con deduplicación por CURP, asistencia y evaluación, DC-3 con plantilla, folio, PDF y hash, viáticos con aprobación.

Fase F — Archivos y facturación propia: bucket privado con URLs firmadas y hash, facturas propias con perfil fiscal, XML/PDF, cancelaciones y adaptador de PAC bajo contrato de KG Safety (Noil queda sólo como respaldo).

Fase G — Dashboard, reportes y notificaciones: indicadores operativos, exportaciones con filtros y correos transaccionales con historial y reintentos.

Fase H (opcional) — Inventario/almacén: módulo nuevo (SKU, marca, existencias, costos, series/lotes, movimientos, certificaciones), ya que no vino en lo recuperado.

## Notas técnicas

- Todo se construye sobre el backend actual con funciones de servidor (`createServerFn`) y RLS por `organization_id`; nada de llamadas a Noil desde el navegador (ya se cumple).
- Los cálculos de cotización y los folios se generan en servidor; el navegador nunca define totales.
- Las excepciones históricas no se corrigen automáticamente: se marcan para revisión humana.
- El inventario y el historial fiscal completo requieren información externa; se documentan como faltantes, no se inventan.

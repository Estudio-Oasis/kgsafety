# Especificación — KG Verify (validación de constancias DC-3)

> **Estado: SOLO ESPECIFICACIÓN. No implementado.** Este documento describe qué
> sería KG Verify para cuando se decida construirlo. No hay código todavía.

## Qué es

KG Verify es un servicio de **validación pública** de las constancias de
competencias/habilidades laborales (**DC-3**, formato STPS) que emite KG Safety.
Permite que una empresa o autoridad confirme que una constancia es **auténtica**
sin llamar por teléfono.

## Problema que resuelve

Las constancias DC-3 en papel/PDF se pueden falsificar. Un verificador (folio +
código) da confianza y profesionaliza el servicio de capacitación.

## Alcance propuesto (MVP)

1. **Folio verificable** en cada DC-3 emitida (ya existe la base de datos:
   tabla `dc3_certificates` con `folio`, `enrollment_id`, `storage_path`).
2. **Página pública** `/verificar/:folio` que muestra:
   - Validez (vigente / no encontrada / revocada).
   - Curso, nivel y fecha.
   - Nombre del participante (parcialmente enmascarado por privacidad).
   - Instructor y agente capacitador (STPS).
   - **Sin** datos personales sensibles completos.
3. **QR** en el PDF de la constancia que apunta a esa página.

## Datos (ya disponibles en el esquema)

- `dc3_certificates` (folio, enrollment_id, generated, storage_path).
- `enrollments` → `participants` (nombre), `course_sessions` → `courses` (curso),
  `instructors`, `training_agents`.

No requiere tablas nuevas para el MVP; sí un endpoint público de solo lectura
que exponga **campos mínimos** con RLS/consulta controlada (el folio actúa como
token de acceso).

## Consideraciones de privacidad

- Enmascarar CURP y nombre completo; mostrar lo mínimo para verificar.
- El folio no debe ser adivinable secuencialmente (usar un componente aleatorio).
- Registrar accesos (auditoría) sin exponer datos personales.

## Lo que falta para construirlo (cuando se priorice)

- Endpoint público `/verificar/:folio` (solo lectura, campos mínimos).
- Generación del folio aleatorio al emitir la DC-3.
- QR en `cfdi-pdf.server.ts` / generador de la constancia.
- Definir política de revocación.

_Prioridad: posterior al cotizador y a la facturación. Es diferenciador comercial,
no bloqueante._

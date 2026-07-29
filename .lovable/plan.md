Plan de mejoras para KG Safety — priorización por impacto comercial y técnico

Objetivo general
Fortalecer la confianza, la velocidad percibida, la captura de leads y la calidad técnica del sitio sin rediseñar la identidad visual ya aprobada.

Fase 1 · Rendimiento y estabilidad (impacto inmediato)

1. Optimización de imágenes
  - Convertir imágenes grandes (hero, cursos, equipos) a formatos modernos (WebP/AVIF) con fallback.
  - Agregar width/height explícitos a todas las imágenes LCP para reducir CLS.
  - Precargar la imagen hero del home.
  - Revisar que todas las imágenes fuera del viewport usen loading="lazy" y decoding="async".
2. Carga condicional de terceros
  - Cargar el script de Instagram embed solo cuando el usuario llegue a esa sección (IntersectionObserver) o diferirlo fuera del camino crítico.
  - Evaluar si el feed de Instagram justifica el peso del script; si no, reemplazar por un grid estático de imágenes con link a la publicación.
3. Fuentes y CSS crítico
  - Verificar que las fuentes de Google usen display=swap (actualmente parece correcto).
  - Reducir el subset de fuentes si solo se usan pesos específicos.

Fase 2 · SEO y descubrimiento (impacto medio-alto)
4. Enriquecer metadatos por ruta

- Agregar og:type, twitter:card y descripciones únicas en todas las rutas de contenido.
- Incluir JSON-LD específicos: Course para /capacitacion, Product para /equipos, Service para /ingenieria y /servicios.

5. Blog técnico real
  - Convertir los 3 artículos actuales en rutas individuales (/blog/nom-009-auditoria, /blog/lvv-lvh-cable-rigid-rail, /blog/recertificacion-anual).
  - Agregar listado de artículos recientes en /blog con fechas, tags y extractos.
  - Cada artículo tendrá CTA hacia /contacto relacionado al tema.
6. Sitemap y robots
  - Verificar que /sitemap.xml incluya todas las rutas públicas y excluya /portal/*.
  - Confirmar que /portal/* tenga noindex,nofollow en todas sus rutas.

Fase 3 · Conversión y UX (impacto comercial alto)
7. Formulario de cotización optimizado

- Convertir el formulario largo de /contacto en pasos (Datos → Servicio → Ubicación → Confirmación).
- Agregar barra de progreso y resumen antes de enviar.
- Mantener la integración ERP intacta.

8. CTAs móviles fijos
  - Agregar una barra inferior en móvil con dos acciones: "Cotizar" y "WhatsApp" en las páginas de servicio, capacitación, ingeniería y equipos.
  - Ocultar en /contacto y /facturacion para evitar distracción.
9. Consolidar banners en home
  - Evaluar si los 5+ banners actuales diluyen la atención. Propuesta: mantener 3 banners estratégicos (diagnóstico gratuito, P.N.P.C., capacitación) y convertir los demás en tarjetas compactas dentro de sus secciones.
10. Testimonios y casos de éxito
  - Agregar 2-3 testimonios con foto, nombre, cargo y empresa en la home o en /nosotros.
    - Si no hay fotos reales, usar iniciales o siluetas con permiso del cliente.

Fase 4 · Contenido y confianza (impacto medio)
11. Página /nosotros
    - Fortalecer con equipo clave, hitos (11 años, 30M+ horas, 5 países), certificaciones y fotos de operación.
    - Agregar mapa o lista de oficinas: Toluca, CDMX, Bogotá, Houston, Toronto.

12. Página /cumplimiento
  - Revisar que tenga contenido actualizado y CTAs claros hacia /contacto.
13. Página /industrias
  - Aunque no está en el menú principal, sigue siendo ruta pública. Decidir si se redirige a /servicios o se actualiza con casos por sector.

Fase 5 · Legal y confianza (impacto regulatorio)
14. Aviso de privacidad y cookies
    - Crear /aviso-de-privacidad con texto real de KG Safety.
    - Agregar banner de cookies si se detecta tráfico internacional (GDPR/LGPD).
    - Incluir enlaces en el footer.

Fase 6 · Portal B2B (impacto futuro)
15. Preparar integración con Lovable Cloud
    - Cuando el cliente lo autorice, migrar los datos mock del portal a tablas reales.
    - Implementar autenticación real, roles y RLS.
    - Mantener el portal como mejora separada para no bloquear las mejoras públicas.

Criterios de éxito

- Lighthouse Performance ≥ 75 en móvil y ≥ 90 en desktop.
- CLS < 0.1 en todas las rutas principales.
- Tiempo de carga de la primera imagen hero < 1.5 s en 4G.
- Aumento de CTAs visibles sin saturar la página.
- 0 errores de contraste crítico en axe/lighthouse a11y.

Preguntas para priorizar

1. ¿Queremos avanzar en todas las fases o prefieres enfocarnos en una (por ejemplo, solo rendimiento + conversión)?
2. ¿Tienes contenido real para testimonios/casos de éxito, o generamos placeholders genéricos con datos aprobados?
3. ¿El feed de Instagram es prioritario, o lo reemplazamos por un grid estático más ligero?
4. ¿Autorizas crear el aviso de privacidad con texto estándar LGPD/GDPR o prefieres que usemos uno que ya tengas?
5. ¿Queremos retomar la integración con Lovable Cloud para el portal en este sprint, o lo dejamos para después de estas mejoras?

# Informe de integración ERP — KG Safety / DSAIX

**Fecha de revisión:** 28 de julio de 2026  

**Alcance:** inspección pública y de solo lectura de `[dsaix.com.mx](http://dsaix.com.mx)`, `[kg-safety.com](http://kg-safety.com)`, `[kgsafety.lovable.app](http://kgsafety.lovable.app)`, `[api-erpnoil.dsaix.com.mx](http://api-erpnoil.dsaix.com.mx)` y su contrato OpenAPI.  

**Limitaciones:** después de la primera revisión, el usuario proporcionó explícitamente la misma credencial que ya estaba expuesta en el sitio anterior y autorizó iniciar sesión. Se usaron sesiones temporales exclusivamente para consultas de catálogo y para proyectar nombres/tipos de campos; no se conservaron ni mostraron contraseña, JWT o valores del usuario. No se consultaron clientes, contratistas o cotizaciones reales, no se invocaron endpoints de creación/actualización/facturación y no se enviaron datos de clientes.

## Conclusión ejecutiva

La API sí cubre una parte importante del flujo comercial: autenticación JWT, clientes, contratistas SSPA, cursos, precios, calendario, cotizaciones y lectura de insumos. Sin embargo, **no hay endpoints de facturación** y **no existe CRUD documentado de productos/insumos**; sólo hay lectura de insumos y mantenimiento de familias/subfamilias.

La integración nueva de cotizaciones ya usa el patrón correcto: el navegador llama funciones del servidor de `[kgsafety.lovable.app](http://kgsafety.lovable.app)`, y esas funciones se comunican con el ERP. El secreto del ERP no aparece en el JavaScript público del sitio nuevo. El catálogo de equipos nuevo, en cambio, es editorial y estático: no está sincronizado con el catálogo ERP.

El hallazgo más urgente es de seguridad: **el sitio anterior publica en su JavaScript una cuenta y contraseña reales de la API** y las usa directamente desde el navegador. No se reproducen en este informe. El catálogo anterior carga correctamente después de ese inicio de sesión, por lo que deben tratarse como credenciales activas o recientemente activas. Hay que rotarlas y revocar sus tokens de inmediato.

Facturación sigue siendo un sistema separado. El sitio nuevo enlaza a la autofacturación del sitio anterior y al portal `[admin-factura-cliente.noilmx.com](http://admin-factura-cliente.noilmx.com)`; la API ERP revisada no documenta ninguna operación de factura, CFDI, XML, PDF, pago o cancelación.

## Arquitectura observada

### Sitio anterior

`[kg-safety.com](http://kg-safety.com)` inicia sesión directamente contra la API desde JavaScript visible al público, conserva el JWT en memoria y llama los endpoints protegidos con `Authorization: Bearer …`. Esto expone la credencial de servicio y permite que cualquier persona replique el acceso.

El catálogo anterior consume el ERP y presenta una taxonomía extensa de familias, subfamilias e insumos. Para cada insumo usa al menos estos campos reales de respuesta, aunque Swagger no los documenta:

- `IdFamilia`, `NombreFamilia`

- `IdSubFamilia`, `NombreSubFamilia`

- `eVisibleWebSubFamilia`

- `IdInsumo`, `Material`

- `URL_AWS_imagen`, `URL_AWS_documento`

El flujo PNPC/SSPA anterior también consulta cursos, paquetes de precios, clientes y contratistas, crea clientes cuando hace falta y finalmente crea la cotización SSPA.

### Sitio nuevo

`kgsafety.lovable.app/contacto` carga el catálogo de cursos y las fechas disponibles mediante funciones de servidor del propio sitio. El JavaScript público sólo contiene identificadores opacos de esas funciones, no la URL ni el secreto del ERP. La página pudo cargar cursos y fechas mientras la misma API devolvía `401` a solicitudes directas sin token; esto confirma el uso de una capa servidor-a-servidor.

El formulario nuevo recopila:

- Obligatorios en la interfaz: nombre, empresa, correo, teléfono, participantes, RFC y consentimiento de privacidad.

- Selecciones: curso, modalidad `LocalForaneo`, tipo `CerradoAbierto` y fecha disponible.

- Opcionales: ubicación y mensaje/comentarios.

Su llamada al servidor usa un objeto con `rfc`, `empresa`, `nombre`, `correo`, `telefono`, `idCurso`, `idServicio`, `participantes`, `lugarCurso`, `tipoCursoCliente`, `lugarServicio`, `comentarios` y `fechaDeseada`. El servidor debe completar o normalizar los campos ERP que no llegan del navegador, como fecha de cotización y estatus.

`kgsafety.lovable.app/equipos` contiene diez categorías editoriales codificadas en el paquete JavaScript. No usa `AlmacenInsumos`, `IdInsumo` ni funciones de servidor. Por tanto, no representa una migración del catálogo ERP, sus imágenes, fichas o identificadores.

`kgsafety.lovable.app/portal/login` es explícitamente un prototipo con datos ficticios. No valida credenciales: cualquier usuario/contraseña permite el flujo, y el rol se guarda en `localStorage` bajo `kg-portal-session`. No debe conectarse a datos reales ni publicarse como portal operativo hasta implementar autenticación y autorización en el servidor.

### Facturación

La página nueva de facturación sólo deriva al usuario a:

1. `[https://kg-safety.com/facturar/proceso](https://kg-safety.com/facturar/proceso`)` para autofacturación.

2. `[https://admin-factura-cliente.noilmx.com/](https://admin-factura-cliente.noilmx.com/`)` para acceso recurrente con correo y contraseña.

3. Correo del área contable para casos especiales.

El proceso anterior muestra datos fiscales como razón social, RFC, código de cliente, domicilio, uso de CFDI y régimen fiscal. Nada de esto está cubierto por el contrato OpenAPI revisado. La migración de facturación requiere un contrato y propietario distintos del API ERP analizado.

## Autenticación confirmada

### Solicitud

`POST [https://api-erpnoil.dsaix.com.mx/api/auth/login](https://api-erpnoil.dsaix.com.mx/api/auth/login`)`

El cuerpo requerido por OpenAPI es JSON:

```json

{

  "email": "<cuenta-de-servicio>",

  "password": "<secreto>"

}

```

Ambos campos están marcados como obligatorios. El sitio anterior envía los mismos campos como formulario URL-encoded; el servidor lo acepta, pero para una integración nueva conviene usar `application/json` y `Accept: application/json`.

### Respuesta y uso

Swagger no documenta el esquema del `200`, pero el código del sitio anterior confirma que el JWT se devuelve en:

```json

{

  "access_token": "<jwt>",

  "token_type": "bearer"

}

```

La verificación autenticada confirmó exactamente esas dos propiedades. La respuesta no incluyó `expires_in`; la caducidad sigue sin estar documentada en el contrato visible.

Las solicitudes protegidas usan:

```http

Authorization: Bearer <access_token>

Accept: application/json

```

OpenAPI declara `bearerAuth` como HTTP Bearer con formato JWT. El servidor sin token responde `401` y `WWW-Authenticate: jwt-auth` en endpoints protegidos.

### Operaciones de sesión

- `POST /api/auth/login` — iniciar sesión; `200` o `401`.

- `POST /api/auth/me` — supuesto usuario autenticado. Sin token devolvió `200 {}`, lo cual es ambiguo. Con token devolvió también campos internos `password` y `remember_token`, además de datos normales de usuario. No se leyeron sus valores. Es una falla grave de minimización: esos atributos deben ocultarse siempre en la serialización.

- `POST /api/auth/logout` — cerrar sesión. No se ejecutó.

### Vacíos del contrato de autenticación

No están documentados:

- duración y caducidad del token;

- mecanismo de renovación/refresh;

- estructura completa de la respuesta de login;

- comportamiento de revocación y logout;

- roles/permisos de la cuenta;

- límites de peticiones y bloqueo por intentos;

- códigos y cuerpos uniformes de error.

## Inventario completo de endpoints documentados

La especificación contiene 30 operaciones agrupadas en nueve etiquetas.

### Almacén — las nueve operaciones declaran Bearer JWT

| Método | Ruta | Propósito |

|---|---|---|

| GET | `/api/AlmacenDocumentos/{FechaFinal}/{FechaInicio}/{IDoctoInsumo}/{IdDocumento}/{IdInsumo}/{Tipo}` | Documentos de insumos |

| GET | `/api/AlmacenFamilias/{IdFamilia}/{TipoInsumo}/{Mantenimiento}/{IdTipoRecurso}` | Familias |

| POST | `/api/AlmacenFamilias` | Crear familia |

| PUT | `/api/AlmacenFamilias/{IdFamilia}` | Actualizar familia |

| GET | `/api/AlmacenImagenes/{IdInsumo}/{IdInsumoImg}/{FechaRegistro}` | Imágenes de insumos |

| GET | `/api/AlmacenInsumos/{Codigo}/{IdFamilia}/{IdSubFamilia}/{IdInsumo}/{TipoInsumo}` | Insumos/productos/servicios |

| GET | `/api/AlmacenSubFamilias/{IdFamilia}/{IdSubFamilia}/{TipoInsumo}` | Subfamilias |

| POST | `/api/AlmacenSubFamilias` | Crear subfamilia |

| PUT | `/api/AlmacenSubFamilias/{IdSubFamilia}` | Actualizar subfamilia |

### Auth

| Método | Ruta | Propósito |

|---|---|---|

| POST | `/api/auth/login` | Obtener JWT |

| POST | `/api/auth/me` | Usuario autenticado |

| POST | `/api/auth/logout` | Revocar/cerrar sesión |

### Calendario y fechas

| Método | Ruta | Propósito |

|---|---|---|

| GET | `/api/calendarioCursosInformacion/{IdCalendario}/{DFecha}` | Detalle de calendario; su respuesta sólo está documentada como `[{}]` |

| POST | `/api/calendarioCursosInformacion/update_reservado` | Cambiar cupo reservado |

| GET | `/api/calendarioCursos/{IdCalendario}/{dFechaCurso}/{IdCotizacionCliente}/{IdCotizacionClienteDet}/{IdServicioCliente}/{IdCurso}/{IdCapacitador}/{ETipoDia}/{ETipoCurso}/{ETipoCursoCliente}/{sFolioCurso}/{EClasificacionFecha}/{IdCotizacionSolicitud}/{EVisbibleWeb}` | Consulta general de calendario |

| GET | `/api/calendarioCursosSolicitud/{IdCalendario}/{dFechaCurso}/{IdCurso}/{ETipoCursoCliente}` | Calendario para cotización |

| POST | `/api/calendarioCursosSolicitud` | Asociar fecha/curso a cotización |

| GET | `/api/fechas/{IdServicioClienteFecha}/{IdServicioClienteDetalle}/{IdServicioCliente}/{IdCliente}/{IdCurso}/{DFechaCapacitacion}` | Fechas de capacitación |

### Clientes

| Método | Ruta | Propósito |

|---|---|---|

| GET | `/api/clientes/{IdCliente}/{RFC}` | Buscar cliente normal |

| POST | `/api/clientes` | Crear cliente normal |

| GET | `/api/clientesSspa/{IdCliente}/{RFC}` | Buscar cliente SSPA |

| POST | `/api/clientesSspa` | Crear cliente SSPA |

### Contratistas SSPA

| Método | Ruta | Propósito |

|---|---|---|

| GET | `/api/contratistasSspa/{IdContratista}/{Activo}` | Consultar contratistas |

| POST | `/api/contratistasSspa` | Crear contratista; sólo `Nombre` está documentado como obligatorio |

### Cotizaciones

| Método | Ruta | Propósito |

|---|---|---|

| GET | `/api/cotizacionSolicitudes/{IdCotizacionSolicitud}/{SCodigoSolicitud}/{DFechaCotizacion}/{IdCliente}/{IdServicio}/{IdCurso}/{ETipoCursoCliente}` | Consultar cotización |

| POST | `/api/cotizacionSolicitudes` | Crear cotización normal |

| POST | `/api/cotizacionSolicitudesSspa` | Crear cotización SSPA |

| PUT | `/api/cotizacionSolicitudes/{IdCotizacionSolicitud}/{IdCliente}/{IdServicio}` | Actualizar cotización |

### Cursos y precios

| Método | Ruta | Propósito |

|---|---|---|

| GET | `/api/cursos/{IdCurso}/{IdCursoGrupo}/{IdAgenteCapacitador}/{NombreCapacitador}/{ETipoAgente}` | Cursos |

| GET | `/api/cursosPrecioPaquetesSspa/{IdCurso}/{IdPaquete}/{ELugarCurso}/{ETipoItem}` | Paquetes/precios SSPA |

### Facturas

**No existe ningún endpoint documentado de facturas, CFDI, pagos, XML/PDF, cancelaciones, notas de crédito o complementos de pago.**

### API de facturación separada descubierta en el sitio anterior

Aunque no forma parte del OpenAPI del ERP, el JavaScript público de `[kg-safety.com/facturar/proceso](http://kg-safety.com/facturar/proceso`)` revela una segunda API en `[https://api-fact.noilmx.com](https://api-fact.noilmx.com`)`. Se identificaron estas rutas:

| Método | Ruta | Uso observado |

|---|---|---|

| GET | `/api/proyecto/contrato/KGSAFETY` | Resolver empresa/proyecto de facturación |

| GET | `/api/adminclientesfacturas/buscar/{cotizacion}` | Validar cotización, cliente y estatus administrativo |

| GET | `/api/masteringresosegresos/buscar/{cotizacion}/{referencia}` | Validar pago/referencia y monto |

| GET | `/api/proveedorcliente/buscar/{codigo}` | Obtener datos fiscales del cliente |

| PUT | `/api/proveedorcliente/{id}` | Actualizar domicilio/teléfono fiscal |

| POST | `/api/facturar/emitir` | Emitir factura |

| GET | `/api/facturafactura/buscar/{valor}/{IdEmpresa?}` | Buscar por folio, UUID o cotización y recuperar XML/PDF |

La emisión observada envía `IdProveedorCliente`, `NoCotizacion`, `Referencia` y `UsoCFDI`. La actualización fiscal envía al menos `Calle`, número exterior/interior, `Colonia`, `CP` y `TelEmpresa`.

No se encontró documentación en las rutas estándar `/api/documentation` o `/docs?api-docs.json`. Estas rutas fueron extraídas del consumidor público, no constituyen un contrato oficial ni garantizan estabilidad.

Hallazgo de seguridad crítico: el sitio anterior llama esa API desde el navegador sin token de autenticación. La API respondió con `Access-Control-Allow-Origin: *` y su preflight anunció `POST` permitido para `/api/facturar/emitir` desde cualquier origen. No se intentó emitir ni modificar una factura. Antes de reutilizar la API, el proveedor debe implementar autenticación/roles en servidor, restringir CORS, idempotencia y auditoría; el sitio nuevo debe acceder sólo mediante su backend.

## Campos y contratos relevantes

### Buscar cliente

`GET /api/clientes/{IdCliente}/{RFC}`

Los dos segmentos son técnicamente obligatorios por ser parámetros de ruta. El valor `-1` deshabilita cada filtro. La respuesta `200` es un arreglo con:

`IdCliente`, `Codigo`, `RFC`, `RazonSocial`, `Correo`, `Telefono_fijo`.

Riesgo: poner RFC en la URL lo deja expuesto en logs, analítica, historiales y proxies. Debe migrarse a query restringido o a una búsqueda POST de solo lectura.

### Crear cliente

`POST /api/clientes`

| Campo | Tipo | Situación documental |

|---|---|---|

| `RFC` | string | Aparece en el esquema, pero no está marcado individualmente como requerido |

| `Nombre` | string | Igual |

| `Correo` | string | Igual; no tiene formato `email` |

| `Telefono_fijo` | string | Igual |

El cuerpo completo sí está marcado como requerido. La respuesta `201` contiene `Mensaje` e `IdCliente`.

`POST /api/clientesSspa` agrega `EClienteEspecial` string, pero tampoco marca propiedades obligatorias. El flujo anterior crea clientes SSPA sin enviar `EClienteEspecial`, por lo que parece existir un valor predeterminado no documentado.

### Crear cotización normal

`POST /api/cotizacionSolicitudes`

Todos estos campos están marcados como obligatorios:

| Campo | Tipo | Observación |

|---|---|---|

| `DFechaCotizacion` | string | Ejemplo `YYYY-MM-DD`, pero sin `format: date` |

| `IdCliente` | integer | Debe obtenerse/buscarse antes |

| `IdServicio` | integer | `0` activa un servicio predeterminado, según descripción |

| `IdCurso` | integer | Del catálogo de cursos |

| `ICantidad` | integer | Participantes/cantidad; sin mínimo documentado |

| `ELugarCurso` | string | Ejemplo `Local`; sin enum |

| `ETipoCursoCliente` | string | La UI usa `CerradoAbierto`; sin enum |

| `sLugarServicio` | string | Conserva una `s` minúscula inconsistente |

| `SCorreoContacto` | string | Sin formato `email` |

| `STelefonoContacto` | string | Sin patrón/longitud |

| `Comentarios` | string | Obligatorio en API aunque sea opcional en la interfaz |

| `Estatus` | string | El flujo anterior usa `Pendiente`; sin enum |

La respuesta `201` sólo tiene descripción; no documenta cuerpo, ID, código o folio. Esto impide construir reintentos seguros y confirmar el registro sin una consulta posterior.

### Crear cotización SSPA

`POST /api/cotizacionSolicitudesSspa` exige los mismos campos y añade `SFolioCurso`.

El sitio anterior también envía `IdContratista` y `SNombreContratista`, campos aceptados por la implementación pero ausentes del OpenAPI. Esto prueba que el contrato publicado no refleja por completo el comportamiento en producción.

### Actualizar cotización

Ruta:

`PUT /api/cotizacionSolicitudes/{IdCotizacionSolicitud}/{IdCliente}/{IdServicio}`

Parámetros de ruta obligatorios: `IdCotizacionSolicitud`, `IdCliente`, `IdServicio`.

Cuerpo obligatorio:

`IdCurso`, `ICantidad`, `ELugarCurso`, `ETipoCursoCliente`, `sLugarServicio`, `SCorreoContacto`, `STelefonoContacto`.

No permite actualizar fecha, comentarios o estatus según el contrato publicado.

### Cursos

`GET /api/cursos/{IdCurso}/{IdCursoGrupo}/{IdAgenteCapacitador}/{NombreCapacitador}/{ETipoAgente}`

Todos los segmentos deben existir; `-1` ignora cada filtro. La respuesta contiene:

`sContrato`, `IdCursoGrupo`, `IdCurso`, `Codigo`, `Curso`, `Curso_Ing`, `iFrecuencia`, `Activo` `SiNo`).

La respuesta real no coincide con OpenAPI: se observó un arreglo de dos elementos, `[listaDeCursos, número]`, no un arreglo plano de objetos. La lista contenía 32 cursos en el momento de la revisión y expuso además campos no documentados como `IdServicio`, `Duracion`, `dCosto`, `dPrecioUnitario`, `dPrecioUnitarioExt`, `Material`, `Servicio`, datos del agente capacitador y banderas de visibilidad web. El adaptador debe normalizar esta envoltura y no acoplar la interfaz directamente a ella.

### Paquetes/precios

`GET /api/cursosPrecioPaquetesSspa/{IdCurso}/{IdPaquete}/{ELugarCurso}/{ETipoItem}`

`-1` ignora filtros. La respuesta contiene:

`sContrato`, `IdCurso`, `IdPaquete`, `STituloPaquete`, `SDescripcion`, `dPrecioUnitario`, `DCantidadPersonas`, `FechaRegistro`.

La respuesta autenticada fue un arreglo plano de 28 paquetes al momento de la revisión y agregó `ELugarCurso` y `ETipoItem`, ausentes del esquema de respuesta publicado.

### Calendario para solicitud

Consulta:

`GET /api/calendarioCursosSolicitud/{IdCalendario}/{dFechaCurso}/{IdCurso}/{ETipoCursoCliente}`

Respuesta:

`IdCalendario`, `dFechaCurso`, `fdFechaCurso`, `IdCurso`, `Curso`, `ETipoCurso`, `ETipoCursoCliente`.

Igual que cursos, la respuesta real observada llegó envuelta como `[lista, número]`, no como el arreglo plano declarado por OpenAPI.

Creación:

`POST /api/calendarioCursosSolicitud`

Campos obligatorios:

- `dFechaCurso`: string con formato `date`.

- `IdCurso`: integer.

- `ETipoCurso`: enum `Local` o `Foraneo`.

- `IdCotizacionSolicitud`: integer.

La respuesta `201` contiene `mensaje` e `IdCalendario`.

Reserva de cupo:

`POST /api/calendarioCursosInformacion/update_reservado`

Campos obligatorios: `IdCalendario` y `cantidad`, ambos integer. Puede devolver `200`, `400` sin cupo o `422` de validación. No se documentan idempotencia ni control de concurrencia.

### Productos/insumos

Consulta principal:

`GET /api/AlmacenInsumos/{Codigo}/{IdFamilia}/{IdSubFamilia}/{IdInsumo}/{TipoInsumo}`

Swagger tipa los cinco parámetros como integer y recomienda `-1` para desactivar filtros. Esto contradice la implementación anterior, que envía `EQUIPO`, `SERVICIO` o `SEGURIDAD` como `TipoInsumo` y funciona. La respuesta `200` no tiene esquema en OpenAPI.

Campos mínimos observados en el consumidor anterior:

`IdFamilia`, `NombreFamilia`, `IdSubFamilia`, `NombreSubFamilia`, `eVisibleWebSubFamilia`, `IdInsumo`, `Material`, `URL_AWS_imagen`, `URL_AWS_documento`.

La consulta autenticada de `EQUIPO` devolvió 81 registros al momento de la revisión: 74 con URL de imagen y 72 con URL de documento. El conjunto real de campos fue:

`Codigo`, `CodigoBarra`, `CodigoSat`, `Description`, `IdFamilia`, `IdInsumo`, `IdMedida`, `IdSubFamilia`, `IdUMContenido`, `Material`, `Medida`, `MedidaContenido`, `NombreFamilia`, `NombreSubFamilia`, `URL_AWS_documento`, `URL_AWS_imagen`, `dCantidad`, `dFecha`, `dTalla`, `eVisibleWebSubFamilia`, `sContrato`, `sModelo`.

Varios campos admiten `null`, entre ellos códigos secundarios, descripción, subfamilia, nombres de familia/subfamilia, URLs, talla, visibilidad y modelo. `Codigo` es realmente string en la respuesta, otra contradicción con el parámetro `Codigo` declarado integer.

La consulta de familias con los cuatro filtros documentados como deshabilitados `-1/-1/-1/-1`) respondió `500` aun con JWT válido. Debe añadirse como caso de defecto para DSAIX y no usarse en producción hasta conocer la combinación correcta o corregir el servidor.

No existen operaciones documentadas para crear o actualizar un insumo/producto. Sólo se pueden crear/actualizar familias y subfamilias.

Crear familia exige:

`Nombre`, `TipoInsumo`, `Mantenimiento`, `IdGrupo`, `Tipo`, `IdTipoRecurso`, `exportacion`.

Actualizar familia exige:

`Nombre`, `Mantenimiento`, `IdTipoRecurso`, `exportacion`.

Crear subfamilia exige:

`IdFamilia`, `Nombre`, `TipoInsumo`, `FrecuenciaMantenimiento`.

Actualizar subfamilia exige:

`Nombre`, `TipoInsumo`, `FrecuenciaMantenimiento`.

`FrecuenciaMantenimiento` admite `Mensual`, `Trimestral`, `Semestral` o `Anual`.

## Flujo de cotización recomendado

La integración debe vivir sólo en el servidor de KG Safety:

1. Iniciar sesión con una cuenta de servicio exclusiva, de mínimo privilegio, almacenada en un gestor de secretos.

2. Cachear el JWT únicamente en el servidor y renovarlo tras `401` o antes de caducar.

3. Consultar cursos y, cuando aplique SSPA, paquetes/precios.

4. Consultar calendario por curso y tipo.

5. Validar RFC y buscar cliente. No devolver al navegador más datos del cliente de los necesarios.

6. Si el cliente no existe, crearlo y conservar `IdCliente`.

7. Crear la cotización normal o SSPA.

8. Exigir que la API devuelva `IdCotizacionSolicitud` y `SCodigoSolicitud`/folio; mientras no lo haga, ejecutar una consulta posterior controlada.

9. Si el usuario eligió fecha, crear la relación de calendario con la cotización.

10. Para cursos abiertos, reservar cupo con una operación idempotente o una clave única; el endpoint actual no lo garantiza.

11. Mostrar sólo un folio de seguimiento y nunca el JWT o respuestas internas.

12. Registrar auditoría técnica con IDs, tiempos y estados, pero sin contraseña, token, RFC completo ni datos fiscales.

## Riesgos priorizados

| Severidad | Riesgo | Evidencia/impacto | Acción |

|---|---|---|---|

| Crítica | Credencial viva expuesta en el JavaScript del sitio anterior | El navegador inicia sesión y carga el catálogo protegido | Rotar contraseña, revocar JWT existentes, retirar la credencial del frontend y auditar accesos |

| Crítica | API de facturación invocada desde navegador sin autenticación visible y con CORS global | El código público ejecuta validaciones, actualización fiscal y emisión directamente; el preflight permite `POST` desde cualquier origen | Suspender acceso directo, autenticar cada operación, restringir CORS, rotar secretos asociados y auditar emisiones/cambios |

| Crítica si se conecta a datos reales | Portal nuevo sin autenticación/autorización | Cualquier credencial y rol; sesión local en `localStorage` | Mantener sólo datos ficticios, bloquear acceso o implementar autenticación/roles en servidor antes de producción |

| Alta | API devuelve trazas internas en errores JSON | Un `401` con `Accept: application/json` expuso clases, archivos y traza de Laravel/JWT | Desactivar debug, normalizar errores y no enviar trazas en producción |

| Alta | `/api/auth/me` serializa atributos internos de autenticación | La respuesta autenticada incluye campos `password` y `remember_token` | Ocultarlos en el modelo/recurso, rotar credenciales y revisar cualquier consumidor o log que haya guardado la respuesta |

| Alta | API de facturación documentada sólo parcialmente | Swagger publica cuatro operaciones, pero omite consulta/validación de cotización, referencia e historial/descarga; tampoco declara autenticación | Exigir contrato OpenAPI completo, sandbox, propietario, SLA y plan de continuidad antes de retirar el sitio anterior |

| Alta | OpenAPI incompleto e inconsistente con producción | Servidor configurado como `localhost`; seguridad ausente en muchas operaciones que en ejecución devuelven `401`; tipos y campos contradictorios | Exigir OpenAPI corregido y fixtures sanitizados antes de ampliar integración |

| Alta | CORS `Access-Control-Allow-Origin: *` | La API permite solicitudes desde cualquier origen; combinado con credenciales filtradas aumenta el abuso | Restringir orígenes o, preferiblemente, permitir acceso sólo al backend/BFF |

| Alta | Creaciones sin idempotencia/folio documentado | Reintentos pueden duplicar cliente, cotización o reserva | Clave de idempotencia, restricciones únicas y respuesta con ID/folio |

| Media | RFC y filtros sensibles en segmentos de URL | Se filtran a logs/historial/proxies | Mover a query restringido o búsqueda POST, enmascarar logs |

| Media | Sin paginación ni límites documentados | `-1` puede devolver conjuntos completos y afectar disponibilidad/exposición | Paginación, límites, scopes y filtros permitidos |

| Media | Enums y tipos ambiguos | `TipoInsumo` integer vs `EQUIPO`; `Foraneo` vs `Foráneo`; campos aceptados no documentados | Contrato canónico y validación compartida |

| Media | Respuestas heterogéneas | A veces arreglo, objeto, string o arreglo mixto; el código anterior incluso contempla `resp[0]` | Envolvente uniforme `{data,error,meta}` y esquemas por código |

| Media | Sin sandbox ni política de versión | Riesgo de probar contra producción y de ruptura silenciosa | Ambiente de pruebas, versionado `/v1`, changelog y fecha de deprecación |

## Acciones inmediatas — primeras 24 horas

1. Solicitar a DSAIX rotación inmediata de la cuenta expuesta y revocación de todos sus JWT activos.

2. Retirar del sitio anterior cualquier `email`, `password` y llamada directa a `/auth/login`; si el sitio debe seguir vivo, mover la llamada a un proxy servidor temporal.

3. Revisar logs desde la primera publicación de esa credencial: IPs, horarios, endpoints consultados/escritos y volúmenes anómalos.

4. Desactivar trazas de excepción en producción y devolver errores JSON mínimos.

5. Confirmar que el portal prototipo usa únicamente datos ficticios; bloquear indexación y acceso externo si existe posibilidad de datos reales.

6. Congelar cambios de escritura durante el inventario, salvo operación normal aprobada por KG Safety.

## Información que debe exigir KG Safety por escrito

- Propietario legal y operativo de la base ERP y de cada dominio/servicio.

- Credencial nueva de servicio con permisos mínimos y procedimiento seguro de entrega; nunca por chat ni código fuente.

- Base URL de producción, sandbox y rangos/IP permitidos.

- Respuesta completa de login, expiración, refresh, revocación y roles.

- OpenAPI corregido con seguridad en todas las rutas, esquemas reales de `200/201/400/401/404/409/422/429/500`, enums, límites y ejemplos sanitizados.

- Esquema real de `AlmacenInsumos` y endpoints faltantes o exportación de productos, familias, subfamilias, imágenes y documentos.

- Esquema de cotizaciones con ID/folio de respuesta, campos SSPA reales e idempotencia.

- Exportación completa y diccionario de datos de clientes, cursos, precios, calendarios, cotizaciones y contratistas; incluir conteos y relaciones.

- Propietario y contrato de facturación: base de datos, PAC/SAT, XML/PDF, cancelaciones, complementos, cuentas, respaldos y SLA.

- Política de respaldo, retención, recuperación, bitácora y plan de salida del proveedor.

## Plan técnico sugerido

### Fase 0 — contención

Rotar/revocar secreto, retirar autenticación del navegador, cerrar trazas y proteger el portal prototipo.

### Fase 1 — contrato y réplica de lectura

Obtener OpenAPI corregido, sandbox y cuenta read-only. Construir un adaptador servidor para auth, cursos, calendarios, clientes, cotizaciones y almacén. Capturar fixtures sanitizados y pruebas de contrato.

### Fase 2 — migración de catálogo

Extraer catálogo ERP con IDs estables, taxonomía, visibilidad web, imágenes y fichas. Definir una tabla de mapeo entre las diez categorías editoriales del sitio nuevo y `IdFamiliaIdSubFamilia` del ERP. Verificar conteos, duplicados, huérfanos, URLs rotas y hashes de archivos. No escribir en producción durante esta fase.

### Fase 3 — cotización en sandbox

Probar sólo con datos sintéticos:

- cliente existente y cliente nuevo;

- RFC inválido/duplicado;

- curso abierto/cerrado;

- local/foráneo;

- con y sin fecha;

- sin cupo;

- token caducado;

- doble clic, timeout y reintento;

- respuestas `401`, `409`, `422`, `429` y `500`.

### Fase 4 — facturación y corte

Mantener enlaces del sistema anterior hasta contar con un plan independiente y probado para facturación. Ejecutar un corte con conciliación por folio, RFC, XML/PDF y estado; conservar rollback y acceso de solo lectura al legado.

## Actualización — API de facturación e implementación nueva (28 de julio de 2026)

La documentación de `[api-fact.noilmx.com](http://api-fact.noilmx.com)` ya está disponible y la página nueva de KG Safety implementa un flujo de autofacturación. La integración visible en el navegador usa dos funciones de servidor del propio sitio para buscar al cliente y solicitar el timbrado; no expone la URL de la API fiscal ni ejecuta esas llamadas directamente desde el navegador. Ésta es una mejora arquitectónica importante frente al sitio anterior.

### Contrato publicado

- `POST /api/facturar/emitir`: requiere `IdProveedorCliente`, `NoCotizacion` y `UsoCFDI`; `Referencia` es opcional. Según la descripción, una sola llamada obtiene datos del ERP, construye CFDI 4.0, timbra con Finkok, guarda la factura, cambia el estado a `Facturado` y envía el XML.

- `GET /api/proveedorcliente/buscar/{codigo}`: acepta código o ID numérico y devuelve razón social, RFC, dirección, teléfono, correo, CP y régimen fiscal.

- `PUT /api/proveedorcliente/{id}`: actualiza calle, números, colonia, CP y teléfono.

- `GET /api/proyecto/contrato/{sContrato}`: devuelve el proyecto y varios identificadores internos de configuración/empresa.

El contrato OpenAPI no define `securitySchemes` ni seguridad global o por operación. Una consulta inocua con un código deliberadamente inexistente respondió sin autenticación, y el servidor devolvió `Access-Control-Allow-Origin: *`. El preflight de emisión también autorizó `POST` y `content-type` desde un origen ajeno. No se envió ninguna solicitud de timbrado ni se usaron datos reales.

### Lo que funciona en la página nueva

- La búsqueda inicial pasa por una función de servidor de `[kgsafety.lovable.app](http://kgsafety.lovable.app)`.

- El flujo es progresivo: primero cliente, después cotización, uso CFDI y referencia opcional.

- Un código inexistente produce un mensaje entendible y no genera errores visibles en consola.

- Tras localizar un cliente se muestra razón social, RFC, CP y régimen; no se exponen credenciales en el paquete público revisado.

- Se conservan alternativas para clientes recurrentes y atención contable.

### Bloqueadores antes de producción

1. La API fiscal debe exigir autenticación servidor-a-servidor de mínimo privilegio. CORS no es autenticación; debe restringirse aunque Lovable ya use funciones de servidor.

2. `POST /facturar/emitir` necesita idempotencia. Una sola llamada tiene múltiples efectos y el contrato no documenta una clave de idempotencia, estado de operación ni tratamiento seguro de timeout/reintento.

3. Agregar una pantalla de confirmación previa con receptor, RFC enmascarado, folio, importe, moneda, impuestos, uso CFDI y correo destino. El formulario actual envía a timbrar directamente y no muestra los importes recuperados de la cotización.

4. El servidor debe demostrar que la cotización pertenece al mismo cliente indicado; no basta recibir por separado `IdProveedorCliente` y `NoCotizacion`.

5. Limitar y auditar la búsqueda de clientes: rate limit, protección contra enumeración, respuesta minimizada y verificación adicional antes de mostrar o modificar datos fiscales.

6. Validar compatibilidad entre régimen fiscal, uso CFDI, código postal y datos del receptor con catálogos SAT. La lista visible incluye usos generales y uno educativo; no todos aplican a todos los receptores.

7. Aclarar la discrepancia de entrega: la página promete XML y PDF, mientras la documentación de emisión sólo afirma envío del XML.

8. Publicar las rutas faltantes que el sistema anterior consumía para validar cotización/referencia y consultar o descargar facturas: `/adminclientesfacturas/buscar/{cotizacion}`, `/masteringresosegresos/buscar/{cotizacion}/{referencia}` y `/facturafactura/buscar/{valor}/{IdEmpresa?}`, o sus reemplazos oficiales.

9. Proporcionar sandbox Finkok/SAT, casos de prueba sintéticos, cancelación, sustitución, complementos de pago, recuperación ante error y conciliación diaria.

### Estado de validación

Se comprobó la documentación, el código público de la página, la llamada de búsqueda mediante función de servidor y el manejo de un código ficticio inexistente. No se certificó el timbrado completo porque hacerlo requeriría una cotización de prueba autorizada en un sandbox y puede producir efectos fiscales/operativos.

## Diagnóstico específico — error al registrar cotización (28 de julio de 2026)

La página nueva sí carga catálogo y calendario desde funciones de servidor, por lo que la lectura autenticada del ERP está operativa. El fallo mostrado al enviar ocurre en el flujo de escritura o al interpretar su respuesta, pero la interfaz actual reemplaza cualquier detalle por un mensaje genérico.

Hallazgos concretos:

- El campo rotulado “Validación de RFC” sólo comprueba longitud de 12 o 13 caracteres. La leyenda “Registro nuevo” significa únicamente “no fue encontrado”; no valida estructura, fecha ni homoclave. El RFC ficticio visible en la prueba contiene una fecha imposible.

- El formulario manda a su función de servidor: `rfc`, `empresa`, `nombre`, `correo`, `telefono`, `idCurso`, `idServicio`, `participantes`, `lugarCurso`, `tipoCursoCliente`, `lugarServicio`, `comentarios` y `fechaDeseada`.

- `POST /api/cotizacionSolicitudes` exige doce campos ERP: `DFechaCotizacion`, `IdCliente`, `IdServicio`, `IdCurso`, `ICantidad`, `ELugarCurso`, `ETipoCursoCliente`, `sLugarServicio`, `SCorreoContacto`, `STelefonoContacto`, `Comentarios` y `Estatus`.

- La única respuesta documentada para crear cotización es `201` sin cuerpo, ID ni folio. Si la función de Lovable ejecuta `response.json()` incondicionalmente o exige un folio en esa respuesta, puede mostrar error aunque el ERP haya guardado la cotización. No debe repetirse el envío hasta consultar el ERP y descartar un duplicado.

- El GET citado por el proveedor es `/api/cotizacionSolicitudes/{IdCotizacionSolicitud}/{SCodigoSolicitud}/{DFechaCotizacion}/{IdCliente}/{IdServicio}/{IdCurso}/{ETipoCursoCliente}` y utiliza `-1` para ignorar filtros. Sirve para consultar cotizaciones guardadas, no para ver intentos fallidos ni constituye una bitácora de actividad.

- La página afirma que permite consultar el estatus, pero el enlace regresa al mismo formulario y no existe una búsqueda de estatus visible.

Corrección requerida en la función de servidor:

1. Validar RFC completo antes de consultar o crear cliente; diferenciar `inválido`, `válido no encontrado` y `existente`.

2. Consultar cliente por RFC y reutilizar `IdCliente`; si no existe, crear una sola vez y conservar el ID devuelto.

3. Mapear explícitamente los doce campos obligatorios de la cotización, usando `Comentarios: "Solicitud web"` cuando esté vacío y `Estatus: "Pendiente"`.

4. Tratar cualquier `2xx` como transporte exitoso. Sólo analizar JSON cuando exista cuerpo JSON; un `201` vacío no es una excepción.

5. Después del `201`, verificar mediante GET filtrado por `IdCliente`, fecha, curso y tipo. Devolver al navegador el ID/código localizado o un estado `recibida_pendiente_verificacion`.

6. No reintentar automáticamente los POST. Añadir idempotencia y comprobar cliente/cotización antes de repetir.

7. Registrar internamente etapa, HTTP status y un `traceId` sin contraseña, token ni RFC completo. La respuesta pública debe incluir `ok`, `stage`, `code`, `message`, `traceId` y `retryable`.

8. Crear una vista administrativa de actividad propia. El GET del ERP sólo muestra registros que llegaron a guardarse y no explica fallos de autenticación, validación, red o parseo.

## Criterios mínimos para aprobar producción

- Ningún secreto o JWT en HTML, JavaScript, repositorio, logs o analítica.

- Backend/BFF obligatorio para todas las llamadas ERP.

- Cuenta de servicio de mínimo privilegio y rotación definida.

- OpenAPI corregido y pruebas automáticas de contrato.

- IDs/folios devueltos en cada creación e idempotencia implementada.

- Autenticación y autorización real del portal.

- Catálogo ERP reconciliado con el sitio nuevo.

- Facturación con propietario, SLA, respaldo y prueba de recuperación.

- Monitoreo de errores, latencia, expiración de token y duplicados.

- Plan de rollback y exportación final firmada por ambas partes.

## Fuentes revisadas

- [DSAIX]([https://dsaix.com.mx/](https://dsaix.com.mx/)) — página pública en mantenimiento.

- [Sitio anterior de KG Safety]([https://kg-safety.com/](https://kg-safety.com/)).

- [Catálogo anterior de equipos]([https://kg-safety.com/AlmacenInsumos/-1/-1/-1/-1/EQUIPO](https://kg-safety.com/AlmacenInsumos/-1/-1/-1/-1/EQUIPO)).

- [Autofacturación anterior]([https://kg-safety.com/facturar/proceso](https://kg-safety.com/facturar/proceso)).

- [Sitio nuevo]([https://kgsafety.lovable.app/](https://kgsafety.lovable.app/)).

- [Cotización del sitio nuevo]([https://kgsafety.lovable.app/contacto](https://kgsafety.lovable.app/contacto)).

- [Catálogo editorial nuevo]([https://kgsafety.lovable.app/equipos](https://kgsafety.lovable.app/equipos)).

- [Facturación del sitio nuevo]([https://kgsafety.lovable.app/facturacion](https://kgsafety.lovable.app/facturacion)).

- [Portal prototipo]([https://kgsafety.lovable.app/portal/login](https://kgsafety.lovable.app/portal/login)).

- [API ERP]([https://api-erpnoil.dsaix.com.mx/](https://api-erpnoil.dsaix.com.mx/)).

- [Swagger UI]([https://api-erpnoil.dsaix.com.mx/api/documentation](https://api-erpnoil.dsaix.com.mx/api/documentation)).

- [Contrato OpenAPI JSON]([https://api-erpnoil.dsaix.com.mx/docs?api-docs.json](https://api-erpnoil.dsaix.com.mx/docs?api-docs.json)).

- [Portal externo de facturación]([https://admin-factura-cliente.noilmx.com/](https://admin-factura-cliente.noilmx.com/)).

- [API de facturación separada]([https://api-fact.noilmx.com/](https://api-fact.noilmx.com/)).

- [Documentación de la API de facturación]([https://api-fact.noilmx.com/api/documentation](https://api-fact.noilmx.com/api/documentation)).

## Nota de evidencia sensible

La credencial pública hallada se omite deliberadamente. Para remediar, no hace falta redistribuirla: basta revisar el código fuente público de las páginas anteriores que cargan catálogo/PNPC, rotar la cuenta correspondiente y eliminar la lógica de login del navegador.

La respuesta de Moisky está incompleta: ese GET permite consultar cotizaciones que sí quedaron guardadas; no muestra intentos fallidos ni explica por qué fallaron.

Lo más probable en tu prueba es una combinación de dos problemas:

- `ASDF123456789` tiene 13 caracteres, pero no es un RFC válido: su fecha sería `12/34/56`. La web sólo cuenta caracteres y confunde “no encontrado” con “válido y nuevo”.
- El ERP documenta que al crear una cotización responde `201` sin cuerpo ni folio. Si Lovable intenta leer JSON obligatoriamente, puede mostrar “No se pudo registrar” aunque el ERP sí haya guardado algo.

Por eso, no repitas todavía la prueba. Primero hay que verificar en el ERP que no se haya creado.

Qué debe corregirse:

1. Validar realmente el RFC.
2. Mostrar etapas separadas: autenticación, búsqueda/alta del cliente, creación y verificación de cotización.
3. Tratar un `201` vacío como respuesta exitosa.
4. Después del POST, consultar el GET para confirmar y recuperar ID/folio.
5. Completar siempre los doce campos obligatorios, incluyendo `Comentarios` y `Estatus: "Pendiente"`.
6. No reintentar automáticamente el POST.
7. Guardar una bitácora propia con `traceId`; el GET del ERP no es una bitácora.
8. Mostrar un error útil como “RFC inválido” o “ERP aceptó la solicitud, pendiente de verificación”, no el mensaje genérico actual.

Mensaje para Moisky:

Necesito confirmar el comportamiento exacto de cotizacionSolicitudes.

La documentación indica que POST /api/cotizacionSolicitudes responde 201 sin body, IdCotizacionSolicitud ni SCodigoSolicitud. ¿Esto es correcto?

Por favor confírmanos:

1. Un ejemplo sanitizado de la respuesta real del POST, incluyendo status, headers y body.
2. Cómo recuperar exactamente la cotización recién creada mediante el GET.
3. Qué valores debemos enviar como -1 y un ejemplo completo de la ruta.
4. Respuestas reales para 400, 401, 404, 409, 422 y 500.
5. Si una cotización puede quedar creada aunque el consumidor reciba timeout o error de conexión.
6. Cómo evitar duplicados al repetir una solicitud.
7. Dónde consultar intentos fallidos, porque el GET sólo permite ver cotizaciones que sí quedaron almacenadas.
8. Si existe sandbox para probar sin contaminar el ERP productivo.

También revisa si la solicitud enviada alrededor de las 16:53 quedó registrada antes de que repitamos la prueba.

Y esto es lo que puedes pegar en Lovable para que lo corrija:

Corrige el flujo de cotización sin cambiar el diseño general.

En la función del servidor:

- Valida el RFC mexicano completo, incluyendo formato y fecha. Distingue entre `rfc_invalido`, `cliente_existente` y `cliente_nuevo`. No consideres válido un RFC únicamente por tener 12 o 13 caracteres.
- Busca primero el cliente por RFC. Si existe, reutiliza IdCliente. Si no existe, créalo una sola vez y conserva el IdCliente retornado.
- Mapea explícitamente POST /api/cotizacionSolicitudes con:  
DFechaCotizacion, IdCliente, IdServicio, IdCurso, ICantidad, ELugarCurso, ETipoCursoCliente, sLugarServicio, SCorreoContacto, STelefonoContacto, Comentarios y Estatus.
- Si comentarios está vacío, usa `Solicitud web`. Usa `Estatus: Pendiente`. Mantén `Foraneo` sin acento si ése es el valor esperado por el ERP.
- Considera exitoso cualquier status HTTP 2xx. No ejecutes response.json() si la respuesta no contiene JSON. El endpoint puede devolver 201 sin body.
- Después del 201, verifica la creación mediante GET /api/cotizacionSolicitudes/{IdCotizacionSolicitud}/{SCodigoSolicitud}/{DFechaCotizacion}/{IdCliente}/{IdServicio}/{IdCurso}/{ETipoCursoCliente}, usando filtros específicos y -1 solamente donde corresponda.
- Si el POST fue aceptado pero todavía no puede localizarse, devuelve `recibida_pendiente_verificacion`; no muestres “No se pudo registrar”.
- No reintentes automáticamente operaciones POST.
- Devuelve al frontend:  
`{ ok, stage, code, message, traceId, retryable, idCotizacionSolicitud, folio }`.
- Registra en servidor cada etapa y status HTTP utilizando traceId, pero nunca contraseña, JWT ni RFC completo.
- En la interfaz muestra errores específicos y seguros. Conserva los datos introducidos si algo falla.
- Agrega una vista administrativa de actividad con fecha, traceId, etapa, resultado, ID/folio ERP y acción de verificación.
- No expongas credenciales ni llames al ERP directamente desde el navegador.

Actualicé también el [informe técnico](/Users/rogerteran/Documents/Codex/2026-07-28/referenced-chatgpt-conversation-this-is-untrusted/outputs/[informe-integracion-erp-kg-safety.md](http://informe-integracion-erp-kg-safety.md)) con este diagnóstico. Yo no envié ninguna cotización ni hice escrituras en producción.  
  
Puedes hacer pruebas sin afectar el ERP para no meternos con la otra empresa
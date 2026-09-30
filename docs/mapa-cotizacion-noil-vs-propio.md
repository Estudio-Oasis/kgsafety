# Mapa: cotización con Noil vs. cotizador propio

Comparación de cómo fluye una cotización con el ERP externo (Noil) y con el
cotizador propio (Supabase), y qué interruptores controlan cada camino.

## Camino ANTES (dependiente de Noil)

```
Sitio /contacto
  └─ erpCreateQuote (serverFn)
       └─ submitQuote()  [erp-submit.server.ts]
            ├─ recordLead()            -> tabla propia `leads` (siempre)
            └─ createQuote()           -> API de Noil (api.noilmx / ERP)
                                          crea la cotización en el ERP externo
```

Si Noil falla, la solicitud entra a una cola (`erp_outbox`) y se reintenta.

## Camino AHORA (propio, independiente)

```
Sitio /contacto
  └─ erpCreateQuote (serverFn)
       └─ submitQuote()  [erp-submit.server.ts]
            ├─ recordLead()            -> tabla propia `leads` (siempre)
            └─ si QUOTE_SOURCE_OF_TRUTH=supabase:
                 submitWebQuote()      [web-quote.server.ts]
                   └─ RPC create_web_quote()  -> tabla `quote_requests` (Supabase)
                        · idempotente por submission_id
                        · rate-limit por correo/IP
                        · solo service_role
                 (si NOIL_SYNC=on: además sincroniza a Noil en segundo plano)
```

Luego, el equipo trabaja la cotización con el **editor** (RPCs `qe_*`):

```
Solicitud (quote_requests)
  └─ qe_create_quote_from_request()  -> crea `quotes` (+ partida inicial si hay curso)
       ├─ qe_add_line / qe_update_line / qe_delete_line  -> `quote_lines`
       │     └─ _recompute_quote_totals()  -> subtotal / IVA / total automáticos
       └─ qe_set_quote_status()            -> estatus de la cotización
```

## Interruptores (variables de entorno)

| Variable | Valores | Efecto |
|---|---|---|
| `QUOTE_SOURCE_OF_TRUTH` | `noil` (def) / `supabase` | Quién es la fuente de verdad de la cotización. |
| `NOIL_SYNC` | `on` (def) / `off` | Si se sigue sincronizando con Noil. `off` = independencia total. |
| `BILLING_PROVIDER` | `noil` (def) / `pac` | Quién timbra las facturas (ver adaptador fiscal). |

## Equivalencias de datos (Noil → propio)

| Concepto | Noil | Propio (Supabase) |
|---|---|---|
| Solicitud | Cotización-solicitud del ERP | `quote_requests` |
| Cotización | Cotización del ERP | `quotes` |
| Partida | Renglón de cotización | `quote_lines` |
| Cliente | master_cliente | `clients` (+ `client_fiscal_profiles`) |
| Curso | Curso del ERP | `courses` (`legacy_id` = id/slug) |
| Precio | Tarifa del ERP | `price_packages` (catálogo STPS 2026) |

## Qué NO cambió

- El registro de `leads` (nuestra base comercial) sigue igual y siempre ocurre
  primero: ninguna solicitud se pierde.
- La facturación sigue con Noil hasta que se decida el PAC (ver
  `docs/auditoria-noil-2026-09-21.md`).

import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n/context";
import { erpListInsumos } from "@/lib/erp.functions";

type Insumo = {
  IdInsumo: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  familia: string;
  subfamilia: string;
  imagen: string | null;
  ficha: string | null;
  medida: string;
};

export function InsumoCatalog({ tipo }: { tipo: "EQUIPO" | "SERVICIO" }) {
  const { t } = useT();
  const list = useServerFn(erpListInsumos);
  const [items, setItems] = useState<Insumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [down, setDown] = useState(false);
  const [familia, setFamilia] = useState<string>("__all");
  const [detalle, setDetalle] = useState<Insumo | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    list({ data: { tipo } })
      .then((r) => {
        if (!alive) return;
        setItems(r.items);
        setDown(!r.ok);
      })
      .catch(() => alive && setDown(true))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [list, tipo]);

  const familias = useMemo(() => [...new Set(items.map((i) => i.familia))].sort((a, b) => a.localeCompare(b, "es")), [items]);
  const visibles = useMemo(
    () => (familia === "__all" ? items : items.filter((i) => i.familia === familia)),
    [items, familia],
  );

  if (loading) {
    return (
      <p className="text-sm text-[color:color-mix(in_oklab,var(--on-surface)_65%,transparent)]">
        {t("Cargando catálogo…")}
      </p>
    );
  }

  if (down || items.length === 0) {
    return (
      <div className="border border-[color:var(--border)] bg-[color:var(--surface-2)] p-5">
        <p className="text-sm mb-3">
          {t("El catálogo en línea no está disponible en este momento. Solicite el listado a un especialista.")}
        </p>
        <Link
          to="/contacto"
          className="inline-block bg-signal text-[color:var(--anchor-fixed)] px-5 py-3 font-bold text-[11px] uppercase tracking-widest border-2 border-[color:var(--anchor-fixed)]"
        >
          {t("Solicitar cotización")} →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setFamilia("__all")}
          className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border ${
            familia === "__all"
              ? "border-brand-blue text-brand-blue"
              : "border-[color:var(--border)] hover:border-brand-blue"
          }`}
        >
          {t("Todo")} · {items.length}
        </button>
        {familias.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFamilia(f)}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border max-w-full break-words text-left ${
              familia === f
                ? "border-brand-blue text-brand-blue"
                : "border-[color:var(--border)] hover:border-brand-blue"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--border)] border border-[color:var(--border)]">
        {visibles.map((i) => (
          <article key={`${i.IdInsumo}-${i.codigo}`} className="bg-[color:var(--surface)] p-4 flex flex-col gap-3">
            <div className="aspect-[4/3] overflow-hidden bg-[color:var(--surface-2)] flex items-center justify-center">
              {i.imagen ? (
                <img
                  src={i.imagen}
                  alt={i.nombre}
                  loading="lazy"
                  className="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
                />
              ) : (
                <span className="text-[10px] uppercase tracking-widest text-[color:color-mix(in_oklab,var(--on-surface)_45%,transparent)]">
                  {t("Sin imagen")}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-brand-blue break-words">
                {i.subfamilia || i.familia}
              </div>
              <h3 className="font-display text-sm uppercase mt-1 break-words">{i.nombre}</h3>
              {i.descripcion && i.descripcion !== i.nombre && (
                <p className="text-xs mt-2 text-[color:color-mix(in_oklab,var(--on-surface)_70%,transparent)] break-words">
                  {i.descripcion}
                </p>
              )}
            </div>
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDetalle(i)}
                className="border border-[color:var(--border)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue"
              >
                {t("Información")}
              </button>
              <Link
                to="/contacto"
                search={{ insumo: i.nombre }}
                className="bg-signal text-[color:var(--anchor-fixed)] border-2 border-[color:var(--anchor-fixed)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest"
              >
                {t("Cotizar")}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {detalle && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-auto flex items-start justify-center">
          <div className="bg-[color:var(--surface)] border border-[color:var(--border)] max-w-2xl w-full mt-16 p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="font-display text-lg uppercase break-words">{detalle.nombre}</h3>
              <button
                type="button"
                onClick={() => setDetalle(null)}
                aria-label={t("Cerrar")}
                className="text-xl leading-none px-2"
              >
                ×
              </button>
            </div>
            {detalle.imagen && (
              <img src={detalle.imagen} alt={detalle.nombre} className="w-full max-h-72 object-contain mb-4" />
            )}
            <dl className="text-sm grid gap-1 mb-4">
              <div>
                <strong>{t("Código")}:</strong> {detalle.codigo || "—"}
              </div>
              <div className="break-words">
                <strong>{t("Familia")}:</strong> {detalle.familia}
                {detalle.subfamilia ? ` · ${detalle.subfamilia}` : ""}
              </div>
              {detalle.medida && (
                <div>
                  <strong>{t("Unidad")}:</strong> {detalle.medida}
                </div>
              )}
              {detalle.descripcion && <p className="mt-2 break-words">{detalle.descripcion}</p>}
            </dl>
            <div className="flex flex-wrap gap-3">
              {detalle.ficha && (
                <a
                  href={detalle.ficha}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[color:var(--border)] px-5 py-3 text-[10px] font-bold uppercase tracking-widest hover:border-brand-blue hover:text-brand-blue"
                >
                  {t("Ficha técnica")} ↗
                </a>
              )}
              <Link
                to="/contacto"
                search={{ insumo: detalle.nombre }}
                className="bg-signal text-[color:var(--anchor-fixed)] border-2 border-[color:var(--anchor-fixed)] px-5 py-3 text-[10px] font-bold uppercase tracking-widest"
              >
                {t("Solicitar cotización")} →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

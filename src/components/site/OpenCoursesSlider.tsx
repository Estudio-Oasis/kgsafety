import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n/context";
import { erpListOpenCourses } from "@/lib/erp.functions";

type OpenCourse = {
  IdCalendario: number;
  IdCurso: number;
  folioCurso: string;
  curso: string;
  ubicacion: string;
  direccion: string;
  cupoMaximo: number;
  cupoReservado: number;
  disponibles: number;
  tipo: string;
  tipoCliente: string;
  imagen: string | null;
  fechas: string[];
};

function fechaLarga(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function OpenCoursesSlider() {
  const { t } = useT();
  const list = useServerFn(erpListOpenCourses);
  const [courses, setCourses] = useState<OpenCourse[]>([]);
  const [i, setI] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    list()
      .then((r) => alive && setCourses(r.courses))
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [list]);

  if (loading || courses.length === 0) return null;

  const c = courses[Math.min(i, courses.length - 1)]!;

  return (
    <section className="px-6 md:px-12 py-14 md:py-20 border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-signal mb-3">
          {t("Cursos abiertos con fecha confirmada")}
        </div>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-px bg-white/10 border border-white/10">
          <div className="bg-steel p-6 md:p-10">
            <h2 className="font-display text-2xl md:text-4xl uppercase leading-tight mb-4 break-words">{c.curso}</h2>
            <dl className="grid gap-2 text-sm text-white/70 mb-6">
              <div>
                <strong className="text-white">{t("Sede")}:</strong> {c.ubicacion || "—"}
                {c.direccion ? ` · ${c.direccion}` : ""}
              </div>
              <div>
                <strong className="text-white">{t("Modalidad")}:</strong> {c.tipo} · {c.tipoCliente}
              </div>
              <div>
                <strong className="text-white">{t("Lugares disponibles")}:</strong> {c.disponibles} {t("de")}{" "}
                {c.cupoMaximo}
              </div>
              {c.fechas.length > 0 && (
                <div className="capitalize">
                  <strong className="text-white normal-case">{t("Próxima fecha")}:</strong> {fechaLarga(c.fechas[0]!)}
                </div>
              )}
            </dl>
            <Link
              to="/contacto"
              search={{ idCurso: String(c.IdCurso), folio: c.folioCurso, tipo: "Abierto" }}
              className="inline-block bg-signal text-anchor border-2 border-anchor px-6 py-3 font-bold text-[11px] uppercase tracking-widest"
            >
              {t("Reservar lugar")} →
            </Link>
          </div>
          <div className="bg-anchor p-6 md:p-8">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
              {t("Calendario vigente")} · {courses.length}
            </div>
            <ul className="grid gap-px bg-white/10 border border-white/10 max-h-80 overflow-auto">
              {courses.map((oc, idx) => (
                <li key={`${oc.IdCalendario}-${oc.IdCurso}`}>
                  <button
                    type="button"
                    onClick={() => setI(idx)}
                    className={`w-full text-left px-4 py-3 text-xs uppercase tracking-widest break-words ${
                      idx === i ? "bg-signal text-anchor font-bold" : "bg-steel text-white/70 hover:text-white"
                    }`}
                  >
                    {oc.curso}
                    <span className="block text-[10px] opacity-70 normal-case tracking-normal">
                      {oc.ubicacion} · {oc.disponibles} {t("lugares")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

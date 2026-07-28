import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n/context";

export function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="bg-anchor border-t border-white/10">
      <div className="px-6 md:px-12 py-16 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-signal grid place-items-center">
              <div className="w-5 h-5 border-[3px] border-anchor" />
            </div>
            <span className="font-display text-lg tracking-tighter uppercase">
              KG <span className="text-signal">Safety</span>
            </span>
          </div>
          <p className="text-white/50 text-sm max-w-md leading-relaxed mb-6">
            {t("Ingeniería aplicada a la eliminación total de riesgos de caída. Soluciones integrales para empresas Clase Mundial en México.")}
          </p>
          <p className="font-display text-signal text-lg tracking-tight">{t("We never fall.")}</p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-5">
            {t("Soluciones")}
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link to="/servicios" className="hover:text-signal">{t("Servicios")}</Link></li>
            <li><Link to="/capacitacion" className="hover:text-signal">{t("Capacitación DC-3")}</Link></li>
            <li><Link to="/ingenieria" className="hover:text-signal">{t("Líneas de vida")}</Link></li>
            <li><Link to="/equipos" className="hover:text-signal">{t("Equipos certificados")}</Link></li>
            <li><Link to="/contratistas" className="hover:text-signal">{t("P.N.P.C.")}</Link></li>
            <li><Link to="/industrias" className="hover:text-signal">{t("Industrias")}</Link></li>
            <li><Link to="/nosotros" className="hover:text-signal">{t("Nosotros")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-5">
            {t("Trámites en línea")}
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link to="/contacto" className="hover:text-signal">{t("Solicitar cotización")}</Link></li>
            <li><Link to="/facturacion" hash="autofactura" className="hover:text-signal">{t("Facturar (CFDI 4.0)")}</Link></li>
            <li><Link to="/facturacion" className="hover:text-signal">{t("Soporte de facturación")}</Link></li>
            <li><Link to="/portal/login" className="hover:text-signal">{t("Portal clientes")}</Link></li>
          </ul>
        </div>


        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-5">
            {t("Contacto")}
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><a href="tel:+527228795076" className="hover:text-signal">+52 722 879 5076</a></li>
            <li><a href="mailto:ventas@kg-safety.com" className="hover:text-signal">ventas@kg-safety.com</a></li>
            <li>
              <a href="https://instagram.com/kg_safety" target="_blank" rel="noopener noreferrer" className="hover:text-signal">
                Instagram · @kg_safety
              </a>
            </li>
            <li className="text-white/50">
              José María Pino Suárez 304-1<br />
              Col. 5 de Mayo, Toluca<br />
              Estado de México, C.P. 50090
            </li>
            <li className="text-white/50">{t("Lun a Vie · 9:00 – 18:00")}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 md:px-12 py-6 pb-24 md:pb-6 flex flex-col md:flex-row justify-between gap-4 text-[10px] tracking-widest uppercase text-white/40">
        <div>{t("© 2025 KG Fall Protection Engineering · Toluca · CDMX · Bogotá · Houston · Toronto")}</div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <span>STPS</span>
          <span>OSHA</span>
          <span>ANSI Z359</span>
          <span>NOM-009-STPS</span>
        </div>
      </div>
    </footer>
  );
}

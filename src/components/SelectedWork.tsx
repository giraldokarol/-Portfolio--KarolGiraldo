import { useRef } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import CoverDriverApp from "@/assets/img/cover-app-driver.png";
import CoverInterface from "@/assets/img/cover-web-app.png";
import CoverCMCIC from "@/assets/img/cover-cmcic.png";
import CoverTuLindero from "@/assets/img/cover-tulindero.png";
import MeshGradient, { type MeshCircle } from "./MeshGradient";
import { useWorkScroll } from "./work/useWorkScroll";
import { WORK_PROJECTS, type WorkProject } from "@/config/site";

// Contenido provisional del marco hasta tener los vídeos.
const MEDIA: Record<WorkProject["id"], string> = {
  driverApp: CoverDriverApp,
  interface: CoverInterface,
  cmcic: CoverCMCIC,
  tulindero: CoverTuLindero,
};

// Las tres "bolitas" del diseño, rellenas con el degradado de malla animado.
// Posición y radio en fracción del ancho/alto de la sección (medidos sobre el diseño de Figma).
const MESH_CIRCLES: MeshCircle[] = [
  { x: 0.327, y: 0.36, r: 0.139 },
  { x: 0.39, y: 0.745, r: 0.071 },
  { x: 0.249, y: 0.71, r: 0.035 },
];
// Móvil: grande detrás del título, mediano a la derecha y pequeño abajo a la izquierda.
const MESH_CIRCLES_MOBILE: MeshCircle[] = [
  { x: 0.3, y: 0.2, r: 0.42 },
  { x: 0.9, y: 0.62, r: 0.26 },
  { x: 0.1, y: 0.82, r: 0.12 },
];

// Misma flecha que el botón "Say Hello" (assets/icons/arrow-right-circle.svg), pero del color del texto.
function ArrowIcon() {
  return (
    <svg className="work__arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15.6 15L18.6 12L15.6 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
      <path d="M4.59999 12H18.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
    </svg>
  );
}

// Sección "Selected work": título a la izquierda, marco central (teléfono o web) y lista de proyectos.
// El HTML muestra el primer proyecto; useWorkScroll fija la sección y recorre los demás con el scroll.
// Estilos: styles/sections/_selected-work.scss
export default function SelectedWork() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const current = WORK_PROJECTS[0];
  const root = useRef<HTMLElement>(null);

  useWorkScroll(root);

  return (
    <section id="projects" className="work" aria-labelledby="work-title" ref={root}>
      <MeshGradient circles={MESH_CIRCLES} mobileCircles={MESH_CIRCLES_MOBILE} />

      <div className="work__inner">
        <header className="work__intro">
          <h2 id="work-title" className="work__title">
            {t("work.title")}
          </h2>
          <p className="work__lead">{t("work.intro")}</p>
        </header>

        <div className={`work__frame work__frame--${current.frame}`}>
          {WORK_PROJECTS.map(({ id }, index) => (
            <img
              key={id}
              src={MEDIA[id]}
              alt={t(`work.items.${id}.imageAlt`)}
              className={`work__media ${index === 0 ? "is-current" : ""}`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>

        {/* Marcos "fantasma" invisibles: el JS mide aquí el tamaño real de cada forma (teléfono / web). */}
        <div className="work__frame-probes" aria-hidden="true">
          <div className="work__frame work__frame--mobile" data-probe="mobile" />
          <div className="work__frame work__frame--web" data-probe="web" />
        </div>

        <nav className="work__list-wrap" aria-label={t("work.listLabel")}>
          <ol className="work__list">
            {WORK_PROJECTS.map(({ id, slug }, index) => (
              <li key={id} className={`work__item ${index === 0 ? "is-revealed is-current" : ""}`}>
                <a
                  href={`/${lang}/work/${slug}`}
                  className="work__link"
                  aria-label={t("work.openProject", { name: t(`work.items.${id}.name`) })}
                >
                  <span className="work__bullet" aria-hidden="true">
                    **
                  </span>
                  <span className="work__name">
                    {t(`work.items.${id}.name`)}
                    <ArrowIcon />
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}

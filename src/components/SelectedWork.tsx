import { useRef } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import ArrowIcon from "./ArrowIcon";
import MeshGradient, { type MeshCircle } from "./MeshGradient";
import { useWorkReveal } from "./work/useWorkReveal";
import { useWorkScroll } from "./work/useWorkScroll";
import { WORK_PROJECTS, type WorkProject } from "@/config/site";

// Vídeo de cada proyecto (public/videos/work/<slug>.mp4) y su portada (<slug>.jpg, el primer fotograma:
// se ve mientras carga y con reduced-motion). La proporción real del vídeo (ancho / alto) hace que el
// marco web se ajuste sin recortes. Si cambias un vídeo, cambia también su portada y su proporción.
const VIDEO_RATIO: Record<WorkProject["id"], number> = {
  driverApp: 786 / 1704,
  interface: 1716 / 1132,
  cmcic: 1728 / 978,
  tulindero: 1920 / 1136,
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

// Sección "Selected work": título a la izquierda, marco central (teléfono o web) y lista de proyectos.
// El HTML muestra el primer proyecto; useWorkScroll fija la sección y recorre los demás con el scroll.
// Estilos: styles/sections/_selected-work.scss
export default function SelectedWork() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const current = WORK_PROJECTS[0];
  const root = useRef<HTMLElement>(null);

  useWorkReveal(root);
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

        {/* Escenario de tamaño fijo: el marco cambia de forma centrado dentro y el texto de abajo no se mueve. */}
        <div className="work__stage">
          <div className="work__screen">
            {/* Los vídeos se reproducen desde useWorkScroll: solo el del proyecto actual y con la sección en pantalla.
                El marco lleva al caso de estudio del proyecto actual (el JS cambia el enlace con el scroll).
                Solo para ratón y táctil: con teclado o lector de pantalla ya están los enlaces de la lista. */}
            <a
              href={`/${lang}/work/${current.slug}`}
              className={`work__frame work__frame--${current.frame}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              {WORK_PROJECTS.map(({ id, slug }, index) => (
                <video
                  key={id}
                  src={`/videos/work/${slug}.mp4`}
                  poster={`/videos/work/${slug}.jpg`}
                  className={`work__media ${index === 0 ? "is-current" : ""}`}
                  data-ratio={VIDEO_RATIO[id]}
                  muted
                  loop
                  playsInline
                  preload={index === 0 ? "metadata" : "none"}
                />
              ))}
            </a>

            {/* Marcos "fantasma" invisibles: el JS mide aquí el tamaño real de cada forma (teléfono / web). */}
            <div className="work__frame-probes" aria-hidden="true">
              <div className="work__frame work__frame--mobile" data-probe="mobile" />
              <div className="work__frame work__frame--web" data-probe="web" />
            </div>
          </div>

          {/* Descripciones apiladas en el mismo sitio: el bloque mide lo que la más larga y no salta. */}
          <div className="work__descriptions">
            {WORK_PROJECTS.map(({ id }, index) => (
              <p key={id} className={`work__description ${index === 0 ? "is-current" : ""}`}>
                {t(`work.items.${id}.description`)}
              </p>
            ))}
          </div>
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
                    <ArrowIcon className="work__arrow" />
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

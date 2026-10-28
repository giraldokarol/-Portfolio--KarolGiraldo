import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import CoverDriverApp from "@/assets/img/cover-app-driver.png";
import CoverInterface from "@/assets/img/cover-web-app.png";
import CoverCMCIC from "@/assets/img/cover-cmcic.png";
import CoverTuLindero from "@/assets/img/cover-tulindero.png";
import { WORK_PROJECTS, type WorkProject } from "@/config/site";

// Contenido provisional del marco hasta tener los vídeos.
const MEDIA: Record<WorkProject["id"], string> = {
  driverApp: CoverDriverApp,
  interface: CoverInterface,
  cmcic: CoverCMCIC,
  tulindero: CoverTuLindero,
};

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
// Estructura estática (fase 1); el scroll que cambia de proyecto llega en la fase 3.
// Estilos: styles/sections/_selected-work.scss
export default function SelectedWork() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const current = WORK_PROJECTS[0];

  return (
    <section id="projects" className="work" aria-labelledby="work-title">
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
                  <span className="work__name">{t(`work.items.${id}.name`)}</span>
                  <ArrowIcon />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}

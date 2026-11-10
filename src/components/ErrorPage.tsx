import { useTranslation } from "react-i18next";

import ArrowIcon from "./ArrowIcon";
import Logo from "./Logo";
import MeshGradient, { type MeshCircle } from "./MeshGradient";
import { WORK_PROJECTS } from "@/config/site";
import type { Locale } from "@/i18n/config";

// Bolitas de color como en "Selected work": grande arriba a la derecha, mediana y pequeña abajo a la izquierda.
const CIRCLES: MeshCircle[] = [
  { x: 0.78, y: 0.3, r: 0.16 },
  { x: 0.2, y: 0.78, r: 0.08 },
  { x: 0.1, y: 0.6, r: 0.035 },
];
const CIRCLES_MOBILE: MeshCircle[] = [
  { x: 0.85, y: 0.18, r: 0.3 },
  { x: 0.15, y: 0.88, r: 0.16 },
  { x: 0.06, y: 0.74, r: 0.07 },
];

// Página de error (404 o error inesperado), en el idioma de la URL (/es/… → español).
// Sin header ni footer completos: sus enlaces dependen de la página, y aquí no la hay.
// La usa el ErrorBoundary de root.tsx. Estilos: styles/pages/_system.scss
export default function ErrorPage({ locale, notFound }: { locale: Locale; notFound: boolean }) {
  const { t } = useTranslation();
  const key = notFound ? "errors.notFound" : "errors.generic";

  return (
    <div className="status-page">
      <title>{`${t(`${key}.title`)} — Karol Giraldo`}</title>
      <meta name="robots" content="noindex" />
      <MeshGradient circles={CIRCLES} mobileCircles={CIRCLES_MOBILE} />

      <header className="status-page__header">
        <a href={`/${locale}`} aria-label={t("errors.home")}>
          <Logo />
        </a>
      </header>

      <main className="status-page__main">
        <p className="status-page__code">{notFound ? "(404)" : "(Error)"}</p>
        <h1 className="status-page__title">{t(`${key}.title`)}</h1>
        <p className="status-page__lead">{t(`${key}.lead`)}</p>
        <a className="btn btn--primary status-page__cta" href={`/${locale}`}>
          {t("errors.back")}
          <ArrowIcon />
        </a>

        {/* Atajos a los casos de estudio: quien llega aquí por un enlace roto suele buscar uno. */}
        <nav className="status-page__work" aria-labelledby="status-work-title">
          <p id="status-work-title" className="status-page__work-title">
            {t("errors.explore")}
          </p>
          <ul className="status-page__work-list">
            {WORK_PROJECTS.map(({ id, slug }) => (
              <li key={id}>
                <a className="status-page__work-link" href={`/${locale}/work/${slug}`}>
                  {t(`work.items.${id}.name`)}
                  <ArrowIcon className="status-page__work-arrow" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}

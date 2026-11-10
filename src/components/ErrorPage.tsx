import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import ArrowIcon from "./ArrowIcon";
import Footer from "./Footer";
import Logo from "./Logo";
import SocialRail from "./SocialRail";
import { useErrorAvatar } from "./error/useErrorAvatar";
import type { Locale } from "@/i18n/config";
// Ilustraciones exportadas de Figma ("Marca Personal" → 404 y 500). Se insertan como SVG en el HTML
// (no como <img>) para poder animar sus capas: cada capa conserva su id de Figma.
import avatar404 from "@/assets/errors/avatar-404.svg?raw";
import avatar500 from "@/assets/errors/avatar-500.svg?raw";
import gradient from "@/assets/errors/gradient.svg";

// Página de error en el idioma de la URL (/es/… → español), diseño de Figma:
//   - 404: no encontrada ("Oops! Wrong turn.") con la muñeca preocupada entre dos "4";
//   - cualquier otro error ("Well, that wasn't the plan.") con la muñeca pensativa entre "5" y "0".
// La usa el ErrorBoundary de root.tsx. Estilos: styles/pages/_error.scss
export default function ErrorPage({
  locale,
  notFound,
}: {
  locale: Locale;
  notFound: boolean;
}) {
  const { t } = useTranslation();
  const key = notFound ? "errors.notFound" : "errors.generic";
  const [first, last] = notFound ? ["4", "4"] : ["5", "0"];
  const avatar = useRef<HTMLDivElement>(null);

  // El SVG se mete a mano, no con dangerouslySetInnerHTML: React lo volvía a insertar tras la carga
  // y la animación se quedaba enganchada al dibujo antiguo. Va antes de useErrorAvatar (que lo anima).
  useLayoutEffect(() => {
    if (avatar.current) avatar.current.innerHTML = notFound ? avatar404 : avatar500;
  }, [notFound]);

  // La muñeca de la 404 sigue al cursor; la de la 500 se queda quieta (su dibujo no está pensado para moverse).
  useErrorAvatar(avatar, notFound);

  return (
    <>
      <title>{`${t(`${key}.title`)} — Karol Giraldo`}</title>
      <meta name="robots" content="noindex" />

      {/* Como un hero: todo cabe en una pantalla, sin scroll. La ilustración se adapta al alto que queda libre. */}
      <div className={`error-layout ${notFound ? "error-layout--404" : ""}`}>
        <div className="page-body">
          <SocialRail />
          <header className="site-header">
            <div className="site-nav">
              <a href={`/${locale}`} aria-label={t("a11y.homeLink")}>
                <Logo />
              </a>
            </div>
          </header>

          <main id="main" className="error-page">
            <img
              className="error-page__gradient"
              src={gradient}
              alt=""
              width={1363}
              height={1096}
            />

            {/* Código de error en grande (decorativo) con la muñeca en medio; el lector lee el código en el h1. */}
            <div className="error-page__visual" aria-hidden="true">
              <div className="error-page__stage">
                <span className="error-page__digit">{first}</span>
                <div ref={avatar} className="error-page__avatar" />
                <span className="error-page__digit">{last}</span>
              </div>
            </div>

            <h1 className="error-page__title">
              <span className="error-page__code">
                {notFound ? "404 — " : "500 — "}
              </span>
              {t(`${key}.title`)}
            </h1>
            <p className="error-page__subtitle">{t(`${key}.subtitle`)}</p>
            <p className="error-page__text">{t(`${key}.text`)}</p>
            <a className="btn btn--primary error-page__cta" href={`/${locale}`}>
              {t("errors.back")}
              <ArrowIcon className="error-page__cta-arrow" />
            </a>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
}

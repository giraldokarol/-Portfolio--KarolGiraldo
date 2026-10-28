import { useRef } from "react";
import { useTranslation } from "react-i18next";

import ScrollHint from "./ScrollHint";
import Avatar from "./Avatar";
import { useHeroGradient } from "./hero/useHeroGradient";
import { useHeroAvatar } from "./hero/useHeroAvatar";
import { useHeroScroll } from "./hero/useHeroScroll";

// HTML = escena 2 (la que se prerenderiza y ve quien tiene reduced-motion).
// La escena 1 (muñeca grande) es el estado inicial que crea useHeroScroll.
// Las animaciones viven en components/hero/*. Estilos: styles/sections/_hero.scss
export default function Hero() {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);

  useHeroGradient(root);
  useHeroAvatar(root);
  useHeroScroll(root);

  return (
    <div className="hero" ref={root}>
      <span aria-hidden="true" className="hero__bg-word">
        {t("hero.backgroundWord")}
      </span>

      <div className="hero__blob hero__blob--yellow" aria-hidden="true" />
      <div className="hero__blob hero__blob--blue" aria-hidden="true" />

      <section className="hero__content" id="home">
        <div className="hero__intro">
          <Avatar label={t("hero.avatarAlt")} className="hero__avatar" />

          <h1 className="hero__title">
            <span className="hero__greeting">{t("hero.greeting")}</span>{" "}
            <span className="hero__role">{t("hero.role")}</span>
          </h1>

          <p className="hero__subtitle">{t("hero.subtitle")}</p>
        </div>

        {/* Caja de selección estilo Figma y cursor de texto: solo los usa la animación de scroll. */}
        <div className="hero__selection" aria-hidden="true">
          <svg className="hero__selection-frame">
            <rect x="0" y="0" width="100%" height="100%" />
          </svg>
          {/* Guías de centro que muestra Figma al mover un elemento. */}
          <svg className="hero__selection-guides">
            <line x1="50%" y1="25%" x2="50%" y2="75%" />
            <line x1="25%" y1="50%" x2="75%" y2="50%" />
          </svg>
          <svg className="hero__selection-center" viewBox="-10 -10 20 20">
            <circle r="2.5" />
            <path d="M0-9V-5M0 5V9M-9 0H-5M5 0H9M-6.4-6.4-3.5-3.5M3.5 3.5 6.4 6.4M-6.4 6.4-3.5 3.5M3.5-3.5 6.4-6.4" />
          </svg>
          <span className="hero__handle hero__handle--tl" />
          <span className="hero__handle hero__handle--tr" />
          <span className="hero__handle hero__handle--bl" />
          <span className="hero__handle hero__handle--br" />
          <span className="hero__selection-size" />
        </div>
        <span className="hero__caret" aria-hidden="true" />

        <div className="hero__scroll">
          <a href="#projects" aria-label={t("a11y.scrollToProjects")}>
            <ScrollHint />
          </a>
        </div>
      </section>
    </div>
  );
}

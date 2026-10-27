import { useTranslation } from "react-i18next";

import ScrollHint from "./ScrollHint";
import HeroImage from "@/assets/img/hero-image.png";
import { SOCIAL_LINKS } from "@/config/site";

// Estado actual del hero, sin animaciones. Se reconstruye en la Fase 3
// siguiendo docs/hero-spec.md. Estilos: styles/sections/_hero.scss
export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className="hero">
      <span aria-hidden="true" className="hero__bg-word">
        {t("hero.backgroundWord")}
      </span>

      <div className="hero__social">
        <ul className="hero__social-list">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hero__social-link link-muted" target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <section className="hero__content" id="home">
        <div className="hero__intro">
          <img src={HeroImage} alt={t("hero.stickerAlt")} className="hero__sticker" />

          <h1 className="hero__title">
            {t("hero.greeting")} <span className="hero__role">{t("hero.role")}</span>
          </h1>

          <p className="hero__subtitle">{t("hero.subtitle")}</p>
        </div>

        <div className="hero__scroll">
          <a href="#projects" aria-label={t("a11y.scrollToProjects")}>
            <ScrollHint />
          </a>
        </div>
      </section>
    </div>
  );
}

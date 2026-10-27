import { useTranslation } from "react-i18next";

import ScrollHint from "./ScrollHint";
import Avatar from "./Avatar";
import { SOCIAL_LINKS } from "@/config/site";

// Escena 2 estática. Estilos: styles/sections/_hero.scss
export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className="hero">
      <span aria-hidden="true" className="hero__bg-word">
        {t("hero.backgroundWord")}
      </span>

      <div className="hero__blob hero__blob--yellow" aria-hidden="true" />
      <div className="hero__blob hero__blob--blue" aria-hidden="true" />

      <div className="hero__social">
        <ul className="hero__social-list">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hero__social-link" target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <section className="hero__content" id="home">
        <div className="hero__intro">
          <Avatar label={t("hero.avatarAlt")} className="hero__avatar" />

          <h1 className="hero__title">
            <span className="hero__greeting">{t("hero.greeting")}</span>{" "}
            <span className="hero__role">{t("hero.role")}</span>
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

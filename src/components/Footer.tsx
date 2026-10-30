import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";

import LogoFooter from "@/assets/img/logo-footer.png";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/config/site";

// PENDIENTE: selector de idioma "EN · FR · ES" (ver docs/pendientes.md).
// Estilos: styles/sections/_footer.scss
export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">

        <div className="site-footer__brand">
          <img src={LogoFooter} alt={t("footer.logoAlt")} className="site-footer__logo" />
        </div>

        <div className="site-footer__columns">

          <div className="site-footer__column">
            <p className="site-footer__title">{t("footer.title")}</p>

            <p className="site-footer__text">{t("footer.text")}</p>

            <p className="site-footer__text site-footer__email">
              <Mail size={18} aria-hidden="true" />
              <span>{CONTACT_EMAIL}</span>
            </p>
          </div>

          <div className="site-footer__column">
            <p className="site-footer__subtitle">{t("footer.socialTitle")}</p>

            <ul className="site-footer__social">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="link-muted" target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </footer>
  );
}

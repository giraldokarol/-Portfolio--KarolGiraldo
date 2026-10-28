import { useTranslation } from "react-i18next";

import { SOCIAL_LINKS } from "@/config/site";

// Redes sociales en vertical, fijas a la izquierda en toda la página (solo escritorio).
// Estilos: styles/components/_social-rail.scss
export default function SocialRail() {
  const { t } = useTranslation();

  return (
    <nav className="social-rail" aria-label={t("a11y.socialNav")}>
      <ul className="social-rail__list">
        {SOCIAL_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="social-rail__link" target="_blank" rel="noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

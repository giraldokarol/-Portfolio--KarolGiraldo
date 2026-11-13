import type { MouseEvent } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import LogoFooter from "@/assets/img/logo-footer.png";
import { LOCALES, setStoredLocale, type Locale } from "@/i18n/config";
import { SOCIAL_LINKS, findSection, legalPath, sectionId, translatePath } from "@/config/site";

// Nombre de cada idioma en su propio idioma: así cualquiera reconoce el suyo (lo leen los lectores de pantalla).
const LOCALE_NAMES = { en: "English", fr: "Français", es: "Español" } as const;

// Año del copyright (se calcula al generar la página).
const YEAR = new Date().getFullYear();

// Footer: copyright | página legal · logo · selector de idioma "EN | FR | ES".
// En móvil también lleva las redes (en escritorio están en el menú flotante, SocialRail).
// Estilos: styles/sections/_footer.scss
export default function Footer() {
  // Idioma de la página (el de la URL, también en la 404: el proveedor de root.tsx ya lo resuelve).
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Locale;
  const { pathname } = useLocation();

  // Cambiar de idioma lleva a la misma página (y a la misma sección de la home) en el otro idioma:
  // /es/casos-de-estudio/driver-app → /fr/etudes-de-cas/driver-app · /es#mi-trayectoria → /fr#mon-parcours.
  const switchLanguage = (code: Locale) => (event: MouseEvent<HTMLAnchorElement>) => {
    setStoredLocale(code); // se recuerda para la próxima visita
    const section = findSection(window.location.hash.slice(1));
    if (section) event.currentTarget.hash = sectionId(section, code);
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <div className="site-footer__meta">
          <p className="site-footer__copyright" suppressHydrationWarning>
            {YEAR}©KarolGiraldo
          </p>
          <a href={legalPath(lang)} className="site-footer__legal">
            {t("footer.legal")}
          </a>
        </div>

        <img src={LogoFooter} alt={t("footer.logoAlt")} width={40} height={34} className="site-footer__logo" />

        <nav className="site-footer__languages" aria-label={t("languagePicker.label")}>
          <ul className="site-footer__language-list">
            {LOCALES.map((code) => (
              <li key={code}>
                <a
                  href={translatePath(pathname, code)}
                  hrefLang={code}
                  lang={code}
                  aria-label={LOCALE_NAMES[code]}
                  aria-current={code === lang ? "true" : undefined}
                  className="site-footer__language"
                  onClick={switchLanguage(code)}
                >
                  {code.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Solo en móvil: allí no se ve el menú flotante de redes. */}
        <ul className="site-footer__social">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="site-footer__social-link" target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

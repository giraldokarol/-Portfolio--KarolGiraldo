import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import LogoFooter from "@/assets/img/logo-footer.png";
import { LOCALES, setStoredLocale } from "@/i18n/config";
import { SOCIAL_LINKS } from "@/config/site";

// Nombre de cada idioma en su propio idioma: así cualquiera reconoce el suyo (lo leen los lectores de pantalla).
const LOCALE_NAMES = { en: "English", fr: "Français", es: "Español" } as const;

// Año del copyright (se calcula al generar la página).
const YEAR = new Date().getFullYear();

// Footer: copyright · logo · selector de idioma "EN | FR | ES".
// En móvil también lleva las redes (en escritorio están en el menú flotante, SocialRail).
// PENDIENTE: enlace a "Mentions légales & confidentialité" (ver docs/pendientes.md).
// Estilos: styles/sections/_footer.scss
export default function Footer() {
  const { t } = useTranslation();
  const { lang } = useParams();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <p className="site-footer__copyright" suppressHydrationWarning>
          {YEAR}©KarolGiraldo
        </p>

        <img src={LogoFooter} alt={t("footer.logoAlt")} width={56} height={47} className="site-footer__logo" />

        <nav className="site-footer__languages" aria-label={t("languagePicker.label")}>
          <ul className="site-footer__language-list">
            {LOCALES.map((code) => (
              <li key={code}>
                <a
                  href={`/${code}`}
                  hrefLang={code}
                  lang={code}
                  aria-label={LOCALE_NAMES[code]}
                  aria-current={code === lang ? "true" : undefined}
                  className="site-footer__language"
                  onClick={() => setStoredLocale(code)} // se recuerda para la próxima visita
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

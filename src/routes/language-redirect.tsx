import { useEffect } from "react";
import { useNavigate } from "react-router";

import { LOCALES, detectLocale } from "@/i18n/config";
import { alternateLinks } from "@/i18n/seo";
import en from "@/locales/en/common.json";
import type { Route } from "./+types/language-redirect";

export const meta: Route.MetaFunction = () => [
  { title: en.seo.title },
  { name: "description", content: en.seo.description },
  ...alternateLinks(null),
];

// Página x-default: solo existe para elegir idioma.
// La redirección ocurre en el navegador (no en el servidor), así Google
// ve esta página y las tres versiones enlazadas, sin redirecciones forzadas.
export default function LanguageRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/${detectLocale()}`, { replace: true });
  }, [navigate]);

  // Respaldo visible si JavaScript está desactivado o tarda.
  return (
    <main className="system-page">
      <nav aria-label={en.languagePicker.label}>
        <ul className="language-list">
          {LOCALES.map((locale, i) => (
            <li key={locale} className="language-list__item">
              {i > 0 && <span aria-hidden="true">·</span>}
              <a className="link-muted" href={`/${locale}`} hrefLang={locale} lang={locale}>
                {locale}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}

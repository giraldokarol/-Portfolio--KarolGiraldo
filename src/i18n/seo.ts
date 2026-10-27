import { SITE_URL } from "@/config/site";
import { LOCALES, type Locale } from "./config";

// Etiquetas <link> canonical + hreflang de una página, en formato `meta` de React Router.
// Cada versión apunta a sí misma (canonical) y a sus hermanas (alternate),
// y "/" es la versión x-default (la que detecta el idioma).
export function alternateLinks(current: Locale | null) {
  const url = (path: string) => `${SITE_URL}${path}`;

  return [
    { tagName: "link", rel: "canonical", href: url(current ? `/${current}` : "/") },
    ...LOCALES.map((locale) => ({
      tagName: "link",
      rel: "alternate",
      hrefLang: locale,
      href: url(`/${locale}`),
    })),
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: url("/") },
  ];
}

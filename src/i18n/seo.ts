import { SITE_URL } from "@/config/site";
import { LOCALES, type Locale } from "./config";

// Etiquetas <link> canonical + hreflang de una página, en formato `meta` de React Router.
// Cada versión apunta a sí misma (canonical) y a sus hermanas (alternate).
// page = lo que va tras el idioma ("" = inicio, "/legal"…). Solo el inicio tiene x-default ("/",
// la que detecta el idioma); en las demás, la versión por defecto es la inglesa.
export function alternateLinks(current: Locale | null, page = "") {
  const url = (path: string) => `${SITE_URL}${path}`;
  const xDefault = page ? `/en${page}` : "/";

  return [
    { tagName: "link", rel: "canonical", href: url(current ? `/${current}${page}` : "/") },
    ...LOCALES.map((locale) => ({
      tagName: "link",
      rel: "alternate",
      hrefLang: locale,
      href: url(`/${locale}${page}`),
    })),
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: url(xDefault) },
  ];
}

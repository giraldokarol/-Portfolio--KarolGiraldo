import { FULL_NAME, SHORT_NAME, SITE_URL, SOCIAL_LINKS, homePath } from "@/config/site";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";
import { i18nByLocale } from "./instances";

// Etiquetas <link> canonical + hreflang de una página, en formato `meta` de React Router.
// Cada versión apunta a sí misma (canonical) y a sus hermanas (alternate).
// pathFor = la dirección de la página en cada idioma (homePath, legalPath…; ver config/site.ts).
// Solo el inicio tiene x-default ("/", la que detecta el idioma); en las demás, la versión inglesa.
export function alternateLinks(current: Locale | null, pathFor: (locale: Locale) => string = homePath) {
  const url = (path: string) => `${SITE_URL}${path}`;
  const xDefault = pathFor === homePath ? "/" : pathFor("en");

  return [
    { tagName: "link", rel: "canonical", href: url(current ? pathFor(current) : "/") },
    ...LOCALES.map((locale) => ({
      tagName: "link",
      rel: "alternate",
      hrefLang: locale,
      href: url(pathFor(locale)),
    })),
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: url(xDefault) },
  ];
}

// Tarjeta al compartir el enlace (LinkedIn, WhatsApp, Slack, X…): título, texto e imagen.
// Imagen de 1200 × 630 por idioma: public/og-image-<idioma>.jpg (la de "/" es la inglesa).
const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};

export function shareMeta(
  current: Locale | null,
  title: string,
  description: string,
  pathFor: (locale: Locale) => string = homePath,
) {
  const locale = current ?? DEFAULT_LOCALE;
  const image = `${SITE_URL}/og-image-${locale}.jpg`;
  const imageAlt = i18nByLocale[locale].t("seo.shareImageAlt");

  return [
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Karol Giraldo" },
    { property: "og:url", content: `${SITE_URL}${current ? pathFor(current) : "/"}` },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:locale", content: OG_LOCALE[locale] },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: imageAlt },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

// Ficha para Google (datos estructurados schema.org, invisible en la página), solo en la home:
// "esta web es de Karol Giraldo Escobar, Product Designer, y estos son sus perfiles". Ayuda a que Google
// relacione el nombre con la web y los perfiles, y a mostrar "Karol Giraldo" como nombre del sitio.
export function structuredData(current: Locale | null) {
  const locale = current ?? DEFAULT_LOCALE;
  const { t } = i18nByLocale[locale];
  const person = `${SITE_URL}/#person`;

  return [
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: SHORT_NAME,
            alternateName: FULL_NAME,
            inLanguage: LOCALES,
            publisher: { "@id": person },
          },
          {
            "@type": "Person",
            "@id": person,
            name: FULL_NAME,
            alternateName: SHORT_NAME,
            jobTitle: "Product Designer",
            description: t("seo.description"),
            url: `${SITE_URL}${homePath(locale)}`,
            image: `${SITE_URL}/og-image-${locale}.jpg`,
            sameAs: SOCIAL_LINKS.map((link) => link.href),
          },
        ],
      },
    },
  ];
}

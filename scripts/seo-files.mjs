// Genera build/client/robots.txt y build/client/sitemap.xml después del build (npm run build).
// No son páginas visibles: solo los leen Google y otros buscadores.
//   - robots.txt: "puedes visitar todo" + dónde está el sitemap.
//   - sitemap.xml: la lista de páginas, cada una con sus versiones en en / fr / es (hreflang).
// Las páginas salen de react-router.config.ts (las mismas que se prerenderizan) y el dominio de
// SITE_URL (src/config/site.ts): si cambia una de las dos cosas, estos archivos se actualizan solos.
import { writeFileSync } from "node:fs";

import config from "../react-router.config.ts";
import { SITE_URL } from "../src/config/site.ts";

const LOCALES = ["en", "fr", "es"];
const OUT = "build/client";

// "/es/work/driver-app" → "/work/driver-app"; "/" (la que detecta el idioma) no entra: solo redirige.
const pages = [
  ...new Set(
    config.prerender.filter((path) => path !== "/").map((path) => path.replace(/^\/[a-z]{2}(?=\/|$)/, "")),
  ),
];

// Igual que src/i18n/seo.ts: solo el inicio tiene x-default "/"; en las demás es la versión inglesa.
const entry = (locale, page) => {
  const links = LOCALES.map(
    (alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${SITE_URL}/${alt}${page}"/>`,
  );
  links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${page ? `/en${page}` : "/"}"/>`);
  return `  <url>\n    <loc>${SITE_URL}/${locale}${page}</loc>\n${links.join("\n")}\n  </url>`;
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.flatMap((page) => LOCALES.map((locale) => entry(locale, page))).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(`${OUT}/sitemap.xml`, sitemap);
writeFileSync(`${OUT}/robots.txt`, robots);
console.log(`SEO: robots.txt + sitemap.xml (${pages.length * LOCALES.length} URLs) → ${OUT}`);

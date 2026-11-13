// Genera build/client/robots.txt y build/client/sitemap.xml después del build (npm run build).
// No son páginas visibles: solo los leen Google y otros buscadores.
//   - robots.txt: "puedes visitar todo" + dónde está el sitemap.
//   - sitemap.xml: la lista de páginas, cada una con sus versiones en en / fr / es (hreflang).
// Las páginas salen de PAGE_PATHS y el dominio de SITE_URL (src/config/site.ts), lo mismo que usa el
// prerender: si cambia algo allí, estos archivos se actualizan solos.
import { writeFileSync } from "node:fs";

import { LOCALES } from "../src/i18n/locales.ts";
import { PAGE_PATHS, SITE_URL, homePath } from "../src/config/site.ts";

const OUT = "build/client";

// Cada página en cada idioma, con sus versiones en los otros (hreflang). Igual que src/i18n/seo.ts:
// solo el inicio tiene x-default "/" (la que detecta el idioma); en las demás es la versión inglesa.
const entry = (pathFor, locale) => {
  const links = LOCALES.map(
    (alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${SITE_URL}${pathFor(alt)}"/>`,
  );
  const xDefault = pathFor === homePath ? "/" : pathFor("en");
  links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${xDefault}"/>`);
  return `  <url>\n    <loc>${SITE_URL}${pathFor(locale)}</loc>\n${links.join("\n")}\n  </url>`;
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PAGE_PATHS.flatMap((pathFor) => LOCALES.map((locale) => entry(pathFor, locale))).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(`${OUT}/sitemap.xml`, sitemap);
writeFileSync(`${OUT}/robots.txt`, robots);
console.log(`SEO: robots.txt + sitemap.xml (${PAGE_PATHS.length * LOCALES.length} URLs) → ${OUT}`);

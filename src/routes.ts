import { type RouteConfig, index, route } from "@react-router/dev/routes";

import { LEGAL_SLUGS, SECTION_IDS, WORK_PROJECTS } from "./config/site.ts";

// Palabras de las direcciones en los tres idiomas (config/site.ts). Cada una es una ruta fija:
// así una dirección desconocida (/en/cualquier-cosa) no coincide con ninguna y da la 404.
// Cada loader comprueba además que la palabra es la de su idioma (/fr/selected-work/… no vale).
const legalWords = [...new Set(Object.values(LEGAL_SLUGS))];
const workWords = [...new Set(Object.values(SECTION_IDS.projects))];

export default [
  // "/" detecta el idioma del visitante y lo lleva a /en, /fr o /es.
  index("routes/language-redirect.tsx"),
  // Una página por idioma; el idioma sale de la URL (:lang).
  route(":lang", "routes/home.tsx"),
  // Mentions légales & confidentialité: /en/legal, /fr/mentions-legales, /es/aviso-legal.
  ...legalWords.map((word) => route(`:lang/${word}`, "routes/legal.tsx", { id: `legal-${word}` })),
  // Casos de estudio, un archivo por proyecto: /en/selected-work/…, /fr/etudes-de-cas/…, /es/casos-de-estudio/…
  ...WORK_PROJECTS.flatMap(({ slug }) =>
    workWords.map((word) => route(`:lang/${word}/${slug}`, `routes/work/${slug}.tsx`, { id: `${slug}-${word}` })),
  ),
] satisfies RouteConfig;

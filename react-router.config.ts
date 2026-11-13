import type { Config } from "@react-router/dev/config";

import { LOCALES } from "./src/i18n/locales.ts";
import { PAGE_PATHS } from "./src/config/site.ts";

export default {
  appDirectory: "src",
  // Sin servidor: el build genera HTML estático listo para cualquier hosting.
  ssr: false,
  // Un HTML real por idioma y página (para Google) + la raíz que detecta el idioma.
  // Las direcciones salen de PAGE_PATHS (src/config/site.ts), en el idioma de cada página.
  prerender: ["/", ...LOCALES.flatMap((locale) => PAGE_PATHS.map((pathFor) => pathFor(locale)))],
} satisfies Config;

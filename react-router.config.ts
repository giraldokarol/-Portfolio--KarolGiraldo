import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  // Sin servidor: el build genera HTML estático listo para cualquier hosting.
  ssr: false,
  // Un HTML real por idioma (para Google) + la raíz que detecta el idioma.
  prerender: ["/", "/en", "/fr", "/es"],
} satisfies Config;

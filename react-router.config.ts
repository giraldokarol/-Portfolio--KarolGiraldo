import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  // Sin servidor: el build genera HTML estático listo para cualquier hosting.
  ssr: false,
  // Un HTML real por idioma y página (para Google) + la raíz que detecta el idioma.
  prerender: [
    "/",
    ...["en", "fr", "es"].flatMap((lang) => [
      `/${lang}`,
      `/${lang}/legal`,
      `/${lang}/work/interface-web-app`,
      `/${lang}/work/driver-app`,
      `/${lang}/work/credit-mutuel-cic`,
    ]),
  ],
} satisfies Config;

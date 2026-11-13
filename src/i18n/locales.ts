// Idiomas del sitio. Cambiar aquí es suficiente para añadir/quitar uno (además de su carpeta en
// src/locales y de sus palabras en las direcciones: SECTION_IDS y LEGAL_SLUGS en config/site.ts).
// Archivo sin dependencias ni navegador: también lo leen el build (react-router.config.ts) y el sitemap.
export const LOCALES = ["en", "fr", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

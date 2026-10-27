import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en/common.json";
import fr from "@/locales/fr/common.json";
import es from "@/locales/es/common.json";
import { LOCALES, type Locale } from "./config";

const resources = { en, fr, es };

// Una instancia de i18next por idioma, creada una sola vez.
// Así cada página prerenderizada (/en, /fr, /es) usa su propio idioma
// sin depender de un estado global que cambie en medio del build.
function createInstance(locale: Locale): i18n {
  const instance = i18next.createInstance();

  instance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: "en",
    resources: { [locale]: { common: resources[locale] }, en: { common: en } },
    defaultNS: "common",
    // Los textos ya están en el bundle: inicialización síncrona,
    // necesaria para que el HTML prerenderizado salga con el texto.
    initAsync: false,
    interpolation: { escapeValue: false }, // React ya escapa el HTML
  });

  return instance;
}

export const i18nByLocale = Object.fromEntries(
  LOCALES.map((locale) => [locale, createInstance(locale)]),
) as Record<Locale, i18n>;

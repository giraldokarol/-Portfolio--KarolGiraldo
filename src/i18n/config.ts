// Idiomas del sitio: la lista está en ./locales.ts (sin dependencias, la usa también el build).
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales.ts";

export { DEFAULT_LOCALE, LOCALES, type Locale };

// Clave donde se guarda la elección manual del visitante.
// La usará el selector "EN · FR · ES" del footer (ver docs/pendientes.md).
const STORAGE_KEY = "preferred-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

// "fr-CA" → "fr". Devuelve null si el idioma no está soportado.
function toLocale(tag: string): Locale | null {
  const base = tag.toLowerCase().split("-")[0];
  return isLocale(base) ? base : null;
}

export function getStoredLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

// Llamar desde el selector del footer cuando el visitante elige un idioma.
export function setStoredLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Navegación privada o almacenamiento bloqueado: no pasa nada.
  }
}

// Orden de prioridad: elección guardada → idiomas del navegador → inglés.
// Solo se usa en "/" (nunca en /en, /fr o /es, que no redirigen).
export function detectLocale(): Locale {
  const stored = getStoredLocale();
  if (stored) return stored;

  for (const tag of navigator.languages ?? [navigator.language]) {
    const locale = toLocale(tag);
    if (locale) return locale;
  }

  return DEFAULT_LOCALE;
}

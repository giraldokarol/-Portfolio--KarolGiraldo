# Pendientes

## En curso (no tocar si lo tiene otro agente)
| Archivo / zona | Agente | Desde |
|---|---|---|
| — | — | — |

**Todo el proyecto está libre** (2026-10-28). Hero terminado: si Codex toca sus archivos (`Hero.tsx`, `Avatar.tsx`,
`components/hero/*`, `lib/gsap.ts`, `_hero.scss`, `_avatar.scss`), que respete la spec (`docs/hero-spec.md`) y no rompa
las animaciones: las capas `data-part` del avatar y las clases `.hero__*` las usan los hooks de GSAP.

## Footer: selector de idioma
Selector discreto y minimalista en el footer: texto `EN · FR · ES`, sin banderas ni desplegable.
Sirve solo para corregir si la detección automática falla.

Ya preparado:
- `LOCALES`, `isLocale`, `setStoredLocale` y `getStoredLocale` en `src/i18n/config.ts`.
- `detectLocale()` ya da prioridad a la elección guardada, así que al volver a `/` el visitante va a su idioma elegido.
- Marcador `PENDIENTE` en `src/components/Footer.tsx`.

Para conectarlo:
1. Enlaces normales `<a href="/fr" hrefLang="fr" lang="fr">FR</a>` (rastreables por Google), el actual con `aria-current="page"`.
2. `onClick` → `setStoredLocale(locale)` antes de navegar.
3. Un `<nav aria-label={t("languagePicker.label")}>` (la clave ya existe en los tres idiomas).
4. Mantener la sección actual al cambiar (`/fr#projects`).

## Configuración
- Dominio real en `SITE_URL` (`src/config/site.ts`); hoy es provisional y se usa en canonical/hreflang.
- Hosting: confirmar que sirve `build/client/en/index.html` en `/en` y `__spa-fallback.html` / 404 para rutas desconocidas.
- Revisar y validar las traducciones provisionales de `src/locales/fr` y `src/locales/es`.

## Header
- Móvil (decidido por Karol, según su Figma): logo más pequeño (~96 px) + botón de contacto reducido a icono de correo.
  Los enlaces "Selected work" / "Behind the work" se ocultan en móvil.
- El botón "Download CV" salió del header (no está en Figma); sigue en la sección About.
- Estado activo del menú (subrayado azul al hacer scroll): se mantiene del sitio anterior, no está en Figma.

## Más adelante
- Imágenes de las cards: WebP/AVIF, `width`/`height`, `loading="lazy"` (cover-tulindero pesa 3,6 MB).
- Fuente: convertir el `.ttf` a `.woff2` (≈ 3 veces menos peso).
- Meta Open Graph (imagen para compartir en LinkedIn).

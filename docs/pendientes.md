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

## Selected work (en curso)
- Fase 1 hecha: estructura estática (título · marco teléfono/web · lista con flecha en hover; móvil apilado con solo el proyecto actual).
- Fase 2 hecha: fondo con mesh gradient animado en WebGL (`components/MeshGradient.tsx`), 3 círculos como en Figma (otra distribución en móvil), pausa fuera de pantalla, quieto con reduced-motion.
- Fase 3 hecha: sección fijada con scroll (`components/work/useWorkScroll.ts`), imágenes que se deslizan dentro del marco, marco teléfono↔web medido con "marcos fantasma", lista acumulada en negro; reduced-motion sin pin y lista completa.
- Fase 4 hecha: al enfocar un proyecto con teclado el scroll salta a él; en móvil los proyectos no actuales siguen accesibles (visually-hidden).
- Fase 5 hecha: vídeos en `public/videos/work/<slug>.mp4`; el marco web toma la proporción de cada vídeo (`VIDEO_RATIO` en SelectedWork.tsx) y su portada es `<slug>.jpg` (primer fotograma): si cambias un vídeo, actualiza ambos. Solo se reproduce el actual, en pausa fuera de pantalla; reduced-motion = portada.
  transforma el marco teléfono ↔ web y pone en negro (acumulado) los proyectos destapados · fase 4 móvil y reduced-motion ·
  fase 5 vídeos dentro del marco (hasta entonces, las imágenes `cover-*.png` como contenido provisional).
- Los enlaces de la lista apuntan a `/:lang/work/:slug` (`WORK_PROJECTS` en `src/config/site.ts`), pero **esas páginas
  de caso de estudio aún no existen**: hoy dan 404.

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

## Contacto (components/Contact.tsx)
- Fase 1 hecha: diseño, fondo de degradado en movimiento (MeshGradient fill), validación, accesibilidad y entrada animada.
  El envío abre de momento el programa de correo (mailto) con todo escrito.
- Fase 2 hecha: envío directo con Web3Forms (lib/contact.ts). PENDIENTE: Karol crea su clave y la pone en
  .env.local (VITE_WEB3FORMS_KEY, ver .env.example). Sin clave, el formulario usa mailto.
- Al publicar en OVH: en el panel de Web3Forms, cambiar el "Website URL" del formulario de localhost al dominio real.
  Y cuando exista el correo del dominio: nueva clave con ese correo + cambiar CONTACT_EMAIL en src/config/site.ts.
- Footer rehecho (copyright | legal · logo · EN | FR | ES; redes solo en móvil). El enlace legal apunta a
  /:lang/legal, que aún no existe (404 hasta crear la página).

## Legal y estadísticas
- Una sola página "Mentions légales & confidentialité" (en/fr/es), enlazada desde el footer y desde una frase junto al
  formulario. Sin banner ni página de cookies (la web no usa cookies; el idioma guardado es una preferencia exenta).
  Sin CGU. Faltan datos de Karol: nombre, estatus (freelance/SIRET o personal), contacto, tiempo de conservación.
- Estadísticas: Cloudflare Web Analytics (gratis, sin cookies, funciona con OVH sin mover el dominio). Instalar al publicar
  y mencionarlo en la política de privacidad. No usar Google Analytics (necesitaría banner de consentimiento).

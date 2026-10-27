# AGENTS.md — Portafolio Karol Giraldo

Reglas compartidas por todos los agentes (Claude Code lee este archivo vía CLAUDE.md; Codex lo lee directamente).

## Proyecto
Portafolio de Product Designer (UI/UX).
- React 19 + TypeScript + Vite 8 + Tailwind CSS v4.
- React Router v8 en modo framework, `ssr: false` + `prerender` → un HTML estático por idioma.
- Animaciones con GSAP (`@gsap/react`, ScrollTrigger, SplitText, DrawSVG — todos incluidos en `gsap`).
- Textos con i18next + react-i18next.

## Estructura
```
react-router.config.ts     rutas a prerenderizar
src/root.tsx               <html lang>, <head>, proveedor de idioma
src/routes.ts              mapa de rutas: "/" y "/:lang"
src/routes/                páginas (language-redirect, home)
src/components/            componentes (Header, Hero, Projects, About, Footer…)
src/i18n/                  config de idiomas, detección, instancias i18next, SEO (hreflang)
src/locales/{en,fr,es}/    TODOS los textos visibles (common.json)
src/config/site.ts         datos no traducibles (URLs, email, dominio)
docs/                      specs y pendientes
```

## Comandos
- `npm run dev` — desarrollo
- `npm run typecheck` — tipos (genera también los tipos de rutas)
- `npm run lint`
- `npm run build` — build + prerender en `build/client`

## Reglas de trabajo
- No instalar/eliminar dependencias, no borrar archivos y no hacer cambios grandes sin confirmación explícita de Karol.
- Trabajar por fases; detenerse al final de cada una para validación.
- Explicar decisiones técnicas en lenguaje simple.
- Commits pequeños y descriptivos (en inglés, formato `tipo: descripción`, p. ej. `feat: add hero gradient`).
- Coordinación entre agentes: no editar archivos que el otro agente tenga "en curso" (lista en `docs/pendientes.md`).
- Mejoras de diseño, accesibilidad o SEO no pedidas: proponerlas, no aplicarlas.

## Textos e idiomas
- Ningún texto visible escrito en componentes: todo va en `src/locales/{en,fr,es}/common.json`.
- Los archivos con `"_meta": { "status": "PROVISIONAL" }` contienen textos provisionales que Karol revisará.
- Las claves que empiezan por `_` son notas, nunca se muestran.
- `/en`, `/fr`, `/es` nunca redirigen. Solo `/` (x-default) detecta el idioma (`src/i18n/config.ts`).
- Cada página: `<html lang>`, canonical y hreflang en/fr/es/x-default (`src/i18n/seo.ts`).
- Las animaciones de texto deben funcionar con cualquier longitud ("Product Designer" vs "Diseñadora de Producto"): nada de anchos fijos por idioma.

## Animación y accesibilidad
- Respetar siempre `prefers-reduced-motion` (con `gsap.matchMedia`); con `reduce` → estado final, sin movimiento.
- Pensar en móvil/táctil: nada depende solo del cursor (`(hover: hover) and (pointer: fine)`).
- Usar `useGSAP` con `scope`; nunca animaciones sin limpieza.
- Texto decorativo con `aria-hidden`; el `h1` es siempre texto real en el HTML.
- No acceder a `window`/`document` fuera de efectos (el sitio se prerenderiza en Node).

## Verificación
- `npm run typecheck`, `npm run lint` y `npm run build` sin errores antes de dar algo por terminado.
- Cambios visuales: capturas con Playwright en escritorio (1440px) y móvil (390px), entrando por `/en`, `/fr` y `/es`.

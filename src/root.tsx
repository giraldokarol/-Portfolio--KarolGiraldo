import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useLocation, useParams } from "react-router";
import { I18nextProvider } from "react-i18next";

import "./styles/main.scss";
import ErrorPage from "./components/ErrorPage";
import fontUrl from "./assets/fonts/JakartaSans-Variable.ttf?url";
import { DEFAULT_LOCALE, isLocale } from "./i18n/config";
import { i18nByLocale } from "./i18n/instances";
import type { Route } from "./+types/root";

export const links: Route.LinksFunction = () => [
  // Icono de la pestaña: uno para el navegador en modo claro y otro para el oscuro (logo claro).
  { rel: "icon", type: "image/svg+xml", href: "/favicon-light.svg", media: "(prefers-color-scheme: light)" },
  { rel: "icon", type: "image/svg+xml", href: "/favicon-dark.svg", media: "(prefers-color-scheme: dark)" },
  // Al guardar la web en la pantalla de inicio del iPhone/iPad.
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  // Precargar la fuente evita el salto de tipografía en el hero.
  { rel: "preload", href: fontUrl, as: "font", type: "font/ttf", crossOrigin: "anonymous" },
];

// Envuelve TODAS las páginas: aquí se decide el lang de <html>.
// Al prerenderizar, cada HTML sale con su lang correcto (en / fr / es).
export function Layout({ children }: { children: ReactNode }) {
  const { lang } = useParams();
  // Sin ruta que coincida (404, p. ej. /es/no-existe) no hay :lang: se lee el idioma del principio de la URL.
  const first = useLocation().pathname.split("/")[1];
  const locale = isLocale(lang) ? lang : isLocale(first) ? first : DEFAULT_LOCALE;

  return (
    // suppressHydrationWarning: el script de abajo añade una clase a <html> antes de que React cargue.
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Antes del primer pintado: si el visitante acepta animaciones, el CSS prepara la escena 1
            del hero (sin que se vea un instante la escena 2). Sin JS o con reduced-motion no hace nada. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(matchMedia("(prefers-reduced-motion: no-preference)").matches)document.documentElement.classList.add("has-motion")`,
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        <I18nextProvider i18n={i18nByLocale[locale]}>{children}</I18nextProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

// Página no encontrada o error inesperado, en el idioma de la URL (components/ErrorPage.tsx).
// En Hostinger, el .htaccess (public/.htaccess) sirve la app para las URLs que no existen,
// y así esta página aparece también en /es/lo-que-sea, con código 404 para Google.
// Solo en desarrollo (npm run dev): añadir ?preview=500 a una URL que no existe muestra la página de error
// inesperado, que si no solo se ve cuando algo falla de verdad. En el sitio publicado no existe.
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const { pathname, search } = useLocation();
  const first = pathname.split("/")[1];
  const locale = isLocale(first) ? first : DEFAULT_LOCALE;
  const preview500 = import.meta.env.DEV && new URLSearchParams(search).get("preview") === "500";
  const notFound = isRouteErrorResponse(error) && error.status === 404 && !preview500;

  return <ErrorPage locale={locale} notFound={notFound} />;
}

import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useParams } from "react-router";
import { I18nextProvider } from "react-i18next";

import "./styles/main.scss";
import fontUrl from "./assets/fonts/JakartaSans-Variable.ttf?url";
import { DEFAULT_LOCALE, isLocale } from "./i18n/config";
import { i18nByLocale } from "./i18n/instances";
import type { Route } from "./+types/root";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  // Precargar la fuente evita el salto de tipografía en el hero.
  { rel: "preload", href: fontUrl, as: "font", type: "font/ttf", crossOrigin: "anonymous" },
];

// Envuelve TODAS las páginas: aquí se decide el lang de <html>.
// Al prerenderizar, cada HTML sale con su lang correcto (en / fr / es).
export function Layout({ children }: { children: ReactNode }) {
  const { lang } = useParams();
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;

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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="system-page">
      <div>
        <p className="pretitle">{is404 ? "404" : "Error"}</p>
        <a className="system-page__link link-muted" href="/">
          karolgiraldo.com
        </a>
      </div>
    </main>
  );
}

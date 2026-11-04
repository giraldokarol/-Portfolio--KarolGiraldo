import { data } from "react-router";

import { isLocale } from "@/i18n/config";
import { i18nByLocale } from "@/i18n/instances";
import { alternateLinks } from "@/i18n/seo";
import Header from "@/components/Header";
import CaseHero from "@/components/case/CaseHero";
import Footer from "@/components/Footer";
import type { Route } from "./+types/driver-app";

const TEXTS = "cases.driverApp";
const SLUG = "driver-app";

// Corre en el build (prerender): un idioma que no existe → 404.
export function loader({ params }: Route.LoaderArgs) {
  if (!isLocale(params.lang)) throw data(null, { status: 404 });
  return { locale: params.lang };
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) return [];
  const { locale } = loaderData;
  const { t } = i18nByLocale[locale];

  return [
    { title: t(`${TEXTS}.seoTitle`) },
    { name: "description", content: t(`${TEXTS}.seoDescription`) },
    ...alternateLinks(locale, "/work/driver-app"),
  ];
};

// Caso de estudio: Driver App (Flexis), la app móvil para conductores de reparto.
// Misma estructura que el de Interface (routes/work/interface-web-app.tsx); se construye por fases: Hero…
export default function DriverApp() {
  return (
    <>
      <Header />
      <main id="main" className="case-study case-study--gray">
        <CaseHero textKey={`${TEXTS}.hero`} slug={SLUG} device="phone" />
      </main>
      <Footer />
    </>
  );
}

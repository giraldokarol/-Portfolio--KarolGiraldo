import { data } from "react-router";

import { isLocale } from "@/i18n/config";
import { i18nByLocale } from "@/i18n/instances";
import { alternateLinks } from "@/i18n/seo";
import Header from "@/components/Header";
import CaseHero from "@/components/case/CaseHero";
import CaseIntro from "@/components/case/CaseIntro";
import Footer from "@/components/Footer";
import type { Route } from "./+types/interface-web-app";

const TEXTS = "cases.interfaceWebApp";
const SLUG = "interface-web-app";

// Capturas de las tarjetas de "The problem / The solution" (public/images/case/interface-web-app/).
const INTRO_IMAGES = ["fleet-overview", "vehicle-detail", "actionable-workflows"] as const;

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
    ...alternateLinks(locale, "/work/interface-web-app"),
  ];
};

// Caso de estudio: Interface (Flexis), la aplicación web para gestores de flota.
// Se construye por fases: Hero y "The problem / The solution". Sin el menú de redes de la izquierda (SocialRail).
export default function InterfaceWebApp() {
  return (
    <>
      <Header />
      <main id="main" className="case-study">
        <CaseHero textKey={`${TEXTS}.hero`} slug={SLUG} />
        <CaseIntro textKey={`${TEXTS}.intro`} slug={SLUG} images={INTRO_IMAGES} />
      </main>
      <Footer />
    </>
  );
}

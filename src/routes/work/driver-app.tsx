import { data } from "react-router";

import { isLocale } from "@/i18n/config";
import { i18nByLocale } from "@/i18n/instances";
import { alternateLinks } from "@/i18n/seo";
import Header from "@/components/Header";
import CaseHero from "@/components/case/CaseHero";
import CaseIntro from "@/components/case/CaseIntro";
import Footer from "@/components/Footer";
import type { Route } from "./+types/driver-app";

const TEXTS = "cases.driverApp";
const SLUG = "driver-app";

// Teléfonos de las tarjetas de "The problem / The solution" (public/images/case/driver-app/, 290 × 488,
// con fondo transparente y su sombra).
const INTRO_IMAGES = ["vehicle-pairing", "video-check-in", "smart-daily-mission"] as const;

// Bolitas gris y azul tras las tarjetas: una tras la primera y otra, más grande, tras la tercera.
const INTRO_ORBS = [
  { x: 4, y: 80, size: 13.5, mobile: { x: 2, y: 22, size: 48 } },
  { x: 72, y: 106, size: 18.5, mobile: { x: 96, y: 78, size: 58 } },
];

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
// Misma estructura que el de Interface (routes/work/interface-web-app.tsx); se construye por fases: Hero, "The problem / The solution"…
export default function DriverApp() {
  return (
    <>
      <Header />
      <main id="main" className="case-study case-study--gray">
        <CaseHero textKey={`${TEXTS}.hero`} slug={SLUG} device="phone" />
        <CaseIntro
          textKey={`${TEXTS}.intro`}
          slug={SLUG}
          images={INTRO_IMAGES}
          imageSize={{ width: 290, height: 488 }}
          device="phone"
          orbs={INTRO_ORBS}
        />
      </main>
      <Footer />
    </>
  );
}

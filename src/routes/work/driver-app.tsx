import { data } from "react-router";

import { isLocale } from "@/i18n/config";
import { i18nByLocale } from "@/i18n/instances";
import { alternateLinks } from "@/i18n/seo";
import Header from "@/components/Header";
import CaseContext from "@/components/case/CaseContext";
import CaseHero from "@/components/case/CaseHero";
import CaseIntro from "@/components/case/CaseIntro";
import CaseProcess, { type ProcessStep } from "@/components/case/CaseProcess";
import CaseQuestion from "@/components/case/CaseQuestion";
import CaseResearch from "@/components/case/CaseResearch";
import Footer from "@/components/Footer";
import type { Route } from "./+types/driver-app";
import { RESEARCH_GAPS } from "./driver-app.research";

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

// Bolitas de "(Context)": una grande abajo a la izquierda (sale un poco de la sección) y una pequeña a la derecha.
const CONTEXT_ORBS = [
  { x: 14, y: 100, size: 26, mobile: { x: 6, y: 96, size: 56 } },
  { x: 88, y: 72, size: 9, mobile: { x: 94, y: 6, size: 24 } },
];

// Bolitas de "How might we…": una pequeña a la izquierda, a media altura, y una grande abajo a la derecha.
const QUESTION_ORBS = [
  { desktop: { x: 12, y: 47, size: 7.9 }, mobile: { x: 8, y: 12, size: 18 } },
  { desktop: { x: 81, y: 67, size: 22.4 }, mobile: { x: 84, y: 82, size: 50 } },
];

// Fotos de fondo de las etapas de "Process" (aparecen al pasar el ratón). Las tres son claras.
const PROCESS_STEPS: ProcessStep[] = [
  { image: "process-1-map", width: 469, height: 372, tone: "light" },
  { image: "process-2-prioritize", width: 502, height: 372, tone: "light" },
  { image: "process-3-design", width: 469, height: 372, tone: "light" },
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
// Misma estructura que el de Interface (routes/work/interface-web-app.tsx); se construye por fases: Hero, "The problem / The solution", "(Context)", "Research", "How might we…", "Process"…
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
        <CaseContext textKey={`${TEXTS}.context`} orbs={CONTEXT_ORBS} />
        <CaseResearch textKey={`${TEXTS}.research`} slug={SLUG} gaps={RESEARCH_GAPS} />
        <CaseQuestion textKey={`${TEXTS}.question`} centered orbs={QUESTION_ORBS} />
        <CaseProcess textKey={`${TEXTS}.process`} slug={SLUG} steps={PROCESS_STEPS} />
      </main>
      <Footer />
    </>
  );
}

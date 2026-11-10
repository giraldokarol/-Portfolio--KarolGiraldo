import { data } from "react-router";

import { isLocale } from "@/i18n/config";
import { i18nByLocale } from "@/i18n/instances";
import { alternateLinks, shareMeta } from "@/i18n/seo";
import Header from "@/components/Header";
import CaseHero from "@/components/case/CaseHero";
import CaseContext from "@/components/case/CaseContext";
import CaseDecisions, { type DecisionImage } from "@/components/case/CaseDecisions";
import CaseFinal from "@/components/case/CaseFinal";
import CaseIntro from "@/components/case/CaseIntro";
import CaseProcess, { type ProcessStep } from "@/components/case/CaseProcess";
import CaseQuestion from "@/components/case/CaseQuestion";
import CaseResearch from "@/components/case/CaseResearch";
import Footer from "@/components/Footer";
import type { Route } from "./+types/interface-web-app";
import { RESEARCH_GAPS } from "./interface-web-app.research";

const TEXTS = "cases.interfaceWebApp";
const SLUG = "interface-web-app";

// Capturas de las tarjetas de "The problem / The solution" (public/images/case/interface-web-app/).
const INTRO_IMAGES = ["fleet-overview", "vehicle-detail", "actionable-workflows"] as const;

// Fotos de fondo de las etapas de "Process" (aparecen al pasar el ratón). tone = cómo es la foto.
const PROCESS_STEPS: ProcessStep[] = [
  { image: "process-1-understand", width: 469, height: 372, tone: "dark" },
  { image: "process-2-define", width: 502, height: 372, tone: "light" },
  { image: "process-3-design", width: 469, height: 372, tone: "dark" },
];

// Composiciones de las tarjetas de "Key Decisions" (fondo transparente).
const DECISION_IMAGES: DecisionImage[] = [
  { image: "decision-1-visibility", width: 622, height: 577 },
  { image: "decision-2-design-system", width: 692, height: 635 },
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
    ...alternateLinks(locale, "/work/interface-web-app"),
    ...shareMeta(locale, t(`${TEXTS}.seoTitle`), t(`${TEXTS}.seoDescription`), "/work/interface-web-app"),
  ];
};

// Caso de estudio: Interface (Flexis), la aplicación web para gestores de flota.
// Se construye por fases: Hero, "The problem / The solution", "(Context)", "Research", "How might we…", "Process", "Key Decisions" y "Final Thoughts". Sin el menú de redes de la izquierda (SocialRail).
export default function InterfaceWebApp() {
  return (
    <>
      <Header />
      <main id="main" className="case-study">
        <CaseHero textKey={`${TEXTS}.hero`} slug={SLUG} />
        <CaseIntro textKey={`${TEXTS}.intro`} slug={SLUG} images={INTRO_IMAGES} />
        <CaseContext textKey={`${TEXTS}.context`} />
        <CaseResearch textKey={`${TEXTS}.research`} slug={SLUG} gaps={RESEARCH_GAPS} />
        <CaseQuestion textKey={`${TEXTS}.question`} />
        <CaseProcess textKey={`${TEXTS}.process`} slug={SLUG} steps={PROCESS_STEPS} />
        <CaseDecisions textKey={`${TEXTS}.decisions`} slug={SLUG} images={DECISION_IMAGES} />
        <CaseFinal textKey={`${TEXTS}.final`} slug={SLUG} photo={{ width: 313, height: 534 }} />
      </main>
      <Footer />
    </>
  );
}

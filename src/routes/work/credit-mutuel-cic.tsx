import { data } from "react-router";

import { isLocale } from "@/i18n/config";
import { i18nByLocale } from "@/i18n/instances";
import { alternateLinks } from "@/i18n/seo";
import Header from "@/components/Header";
import { CM_CIC_PUBLIC_SITE_URL } from "@/config/site";
import CaseContext from "@/components/case/CaseContext";
import CaseHero from "@/components/case/CaseHero";
import CaseIntro from "@/components/case/CaseIntro";
import CaseResearch from "@/components/case/CaseResearch";
import BankMosaic from "@/components/case/bank/BankMosaic";
import BankReuse from "@/components/case/bank/BankReuse";
import BankSplit from "@/components/case/bank/BankSplit";
import Footer from "@/components/Footer";
import type { Route } from "./+types/credit-mutuel-cic";
import { challengeGaps } from "./credit-mutuel-cic.challenge";

const TEXTS = "cases.creditMutuelCic";
const SLUG = "credit-mutuel-cic";

// Componentes ficticios (marcas Banque Alpha y Banque Beta): textos en <TEXTS>.bank.
const BANK = `${TEXTS}.bank`;

// Visuales de las tarjetas de "The problem / The solution", hechos en código con las marcas ficticias
// (por confidencialidad, sin capturas reales). Los nombres solo sirven de clave.
const INTRO_CARDS = ["components", "brands", "reuse"] as const;
const INTRO_VISUALS = [
  <BankMosaic key="components" textKey={BANK} />,
  <BankSplit key="brands" textKey={BANK} />,
  <BankReuse key="reuse" textKey={BANK} />,
];

// Composiciones de "Challenge" (con los mismos componentes ficticios).
const CHALLENGE_GAPS = challengeGaps(BANK);

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
    ...alternateLinks(locale, "/work/credit-mutuel-cic"),
  ];
};

// Caso de estudio: rediseño del framework CSS de la banca online de Crédit Mutuel y CIC.
// Misma estructura y colores que el de Interface (routes/work/interface-web-app.tsx); se construye por
// fases: Hero, "The problem / The solution", "(Context)", "Challenge"… Por confidencialidad, los demás visuales usan marcas ficticias.
export default function CreditMutuelCic() {
  return (
    <>
      <Header />
      <main id="main" className="case-study">
        {/* Vídeo de la maqueta: 1920 × 1278. */}
        <CaseHero textKey={`${TEXTS}.hero`} slug={SLUG} videoRatio={1920 / 1278} />
        <CaseIntro textKey={`${TEXTS}.intro`} slug={SLUG} images={INTRO_CARDS} visuals={INTRO_VISUALS} />
        <CaseContext textKey={`${TEXTS}.context`} link={CM_CIC_PUBLIC_SITE_URL} />
        <CaseResearch textKey={`${TEXTS}.challenge`} slug={SLUG} gaps={CHALLENGE_GAPS} />
      </main>
      <Footer />
    </>
  );
}

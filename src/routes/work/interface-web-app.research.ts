import type { ResearchGap } from "@/components/case/CaseResearch";

// Composiciones de los tres huecos de "Research" (CaseResearch.tsx), medidas sobre el diseño de Figma.
// Posiciones en % de cada caja (ver los tipos en CaseResearch.tsx). Móvil: otra distribución, más grande,
// para que las capturas se lean en una pantalla estrecha.
export const RESEARCH_GAPS: readonly ResearchGap[] = [
  // 01 · Datos sin prioridades: gráfico + dos widgets encima.
  {
    stage: { x: 0, w: 109, ratio: 2.88, mobileRatio: 1.4 },
    images: [
      {
        name: "gap-1-chart",
        width: 377,
        height: 294,
        desktop: { x: 31.8, y: 0, w: 44.6 },
        mobile: { x: 17.5, y: 0, w: 70 },
      },
      {
        name: "gap-1-charge-points",
        width: 397,
        height: 162,
        desktop: { x: 0, y: 35, w: 46.3 },
        mobile: { x: 0, y: 63, w: 64.3 },
      },
      {
        name: "gap-1-charging",
        width: 361,
        height: 138,
        desktop: { x: 58.3, y: 13, w: 41.7 },
        mobile: { x: 41.5, y: 49, w: 58.5 },
      },
    ],
  },
  // 02 · Información dispersa: furgoneta + tarjetas de carga a su alrededor.
  {
    stage: { x: 10.7, w: 89, ratio: 2.8, mobileRatio: 1.59 },
    images: [
      {
        name: "gap-2-van",
        width: 1331,
        height: 442,
        desktop: { x: 0, y: 10.3, w: 96.5 },
        mobile: { x: 0, y: 27.9, w: 100 },
      },
      {
        name: "gap-2-wallbox",
        width: 270,
        height: 166,
        desktop: { x: 63.3, y: 0, w: 36.7 },
        mobile: { x: 50.3, y: 0, w: 49.7 },
      },
      {
        name: "gap-2-available",
        width: 374,
        height: 144,
        desktop: { x: 4.2, y: 46.6, w: 27 },
        mobile: { x: 0, y: 69.8, w: 49.7 },
      },
    ],
  },
  // 03 · Un solo usuario: selector de rol con solo "Fleet Manager" activo.
  {
    stage: { x: 15.2, w: 77.5, ratio: 1.935, mobileRatio: 1.15 },
    roles: [
      { id: "fleetAdvisor", icon: "advisor", state: "faded", desktop: { x: 62.2, y: 0, w: 38.2 }, mobile: { x: 52, y: 0, w: 48 } },
      { id: "financialManager", icon: "money", state: "ghost", desktop: { x: 37.8, y: 44.6, w: 38.2 }, mobile: { x: 46, y: 56, w: 48 } },
      { id: "dispatcher", icon: "box", state: "default", desktop: { x: 0, y: 28.9, w: 38.2 }, mobile: { x: 0, y: 42, w: 48 } },
      { id: "fleetManager", icon: "badge", state: "selected", desktop: { x: 30.8, y: 1.5, w: 38.2 }, mobile: { x: 20, y: 8, w: 48 } },
    ],
  },
];

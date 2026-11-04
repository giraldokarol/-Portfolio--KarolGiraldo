import type { ResearchGap } from "@/components/case/CaseResearch";

// Composiciones de los tres huecos de "Research" (CaseResearch.tsx), medidas sobre el diseño.
// Posiciones en % de cada caja (ver los tipos en CaseResearch.tsx). Las imágenes traen su margen
// transparente y su sombra: las medidas ya lo descuentan. Móvil: el hueco 01 se reparte de arriba abajo
// (no conectado → furgoneta → conectado → listo) para que las tarjetas se lean; los otros dos mantienen
// la composición de escritorio.
export const RESEARCH_GAPS: readonly ResearchGap[] = [
  // 01 · Herramientas dispersas: furgoneta entre tres tarjetas de estado (no conectada → conectada → lista).
  {
    stage: { x: -7, w: 116, ratio: 2.465, mobileRatio: 1.05 },
    images: [
      {
        name: "gap-1-not-connected",
        width: 372,
        height: 122,
        desktop: { x: 0, y: 14.9, w: 46.2 },
        mobile: { x: 0, y: 0, w: 62 },
      },
      {
        name: "gap-1-van",
        width: 374,
        height: 327,
        desktop: { x: 23, y: 0, w: 46.4 },
        mobile: { x: 18, y: 14.4, w: 64 },
      },
      {
        name: "gap-1-connected",
        width: 398,
        height: 69,
        desktop: { x: 50.6, y: 2.7, w: 49.4 },
        mobile: { x: 28, y: 61, w: 72 },
      },
      {
        name: "gap-1-ready",
        width: 250,
        height: 64,
        desktop: { x: 63.2, y: 41, w: 31 },
        mobile: { x: 40, y: 79.7, w: 60 },
      },
    ],
  },
  // 02 · No pensado para conductores: teléfono con la indicación de ruta, la furgoneta vista desde arriba
  // y la tarjeta "Find Your Vehicle" delante.
  {
    stage: { x: 25, w: 69.2, ratio: 1.321, mobileRatio: 1.321, y: -11 },
    images: [
      {
        name: "gap-2-phone",
        width: 390,
        height: 294,
        desktop: { x: 17.4, y: 0, w: 81.2 },
        mobile: { x: 17.4, y: 0, w: 81.2 },
      },
      {
        name: "gap-2-van-top",
        width: 118,
        height: 118,
        desktop: { x: 17.2, y: 28.8, w: 24.6 },
        mobile: { x: 17.2, y: 28.8, w: 24.6 },
      },
      {
        name: "gap-2-directions",
        width: 158,
        height: 123,
        desktop: { x: 67.1, y: 12.4, w: 32.9 },
        mobile: { x: 67.1, y: 12.4, w: 32.9 },
      },
      {
        name: "gap-2-find-vehicle",
        width: 446,
        height: 162,
        desktop: { x: 0, y: 55.5, w: 92.8 },
        mobile: { x: 0, y: 55.5, w: 92.8 },
      },
    ],
  },
  // 03 · Sin vínculo conductor–vehículo: la furgoneta delante de la tarjeta "Find Your Vehicle" y del enlace.
  {
    stage: { x: 18.6, w: 89.9, ratio: 1.564, mobileRatio: 1.564, y: -8.5 },
    images: [
      {
        name: "gap-3-link",
        width: 639,
        height: 631,
        desktop: { x: 56.7, y: 12.4, w: 33.6 },
        mobile: { x: 56.7, y: 12.4, w: 33.6 },
      },
      {
        name: "gap-3-find-vehicle",
        width: 446,
        height: 162,
        desktop: { x: 0, y: 29.5, w: 69.8 },
        mobile: { x: 0, y: 29.5, w: 69.8 },
      },
      {
        name: "gap-3-van",
        width: 604,
        height: 403,
        desktop: { x: 4, y: 0, w: 96 },
        mobile: { x: 4, y: 0, w: 96 },
      },
    ],
  },
];

import type { ResearchGap } from "@/components/case/CaseResearch";
import {
  BankAccountRow,
  BankAdvisorMessage,
  BankDevTools,
  BankIconField,
  BankOverridesAlert,
  BankPagesFan,
  BankThemedPair,
  BankThemeLines,
} from "@/components/case/bank/BankChallenge";

// Composiciones de los tres puntos de "Challenge" (la sección Research de los otros casos, CaseResearch.tsx),
// hechas en código con los componentes ficticios. Posiciones en % de cada caja (x, y = esquina de arriba
// a la izquierda; w = ancho). En móvil, la misma composición (la caja tiene la misma proporción).
export function challengeGaps(bank: string): readonly ResearchGap[] {
  return [
    // 01 · Un área de clientes enorme: botones de iconos de fondo, el abanico de páginas en el centro,
    // un mensaje del asesor arriba a la derecha y una línea de cuenta abajo a la izquierda.
    // y: la composición sube unos 20 px (3,4 % del ancho de la caja en escritorio).
    {
      stage: { x: 6, w: 96, ratio: 1.6, mobileRatio: 1.6, y: -3.4 },
      layers: [
        {
          id: "icons",
          node: <BankIconField />,
          full: true,
          desktop: { x: 0, y: 0, w: 100 },
          mobile: { x: 0, y: 0, w: 100 },
        },
        { id: "fan", node: <BankPagesFan />, desktop: { x: 22, y: 20, w: 52 }, mobile: { x: 22, y: 20, w: 52 } },
        {
          id: "message",
          node: <BankAdvisorMessage textKey={bank} />,
          desktop: { x: 55, y: 8, w: 43 },
          mobile: { x: 55, y: 8, w: 43 },
        },
        {
          id: "account",
          node: <BankAccountRow textKey={bank} />,
          desktop: { x: 4, y: 70, w: 44 },
          mobile: { x: 4, y: 70, w: 44 },
        },
      ],
    },
    // 02 · Dos marcas, un código: la base neutra arriba (justo bajo el texto) y, debajo, sus dos versiones
    // de marca, una a cada lado, unidas con líneas finas.
    {
      stage: { x: 14, w: 80, ratio: 1.5, mobileRatio: 1.5 },
      layers: [
        {
          id: "lines",
          node: <BankThemeLines />,
          full: true,
          desktop: { x: 0, y: 0, w: 100 },
          mobile: { x: 0, y: 0, w: 100 },
        },
        {
          id: "default",
          node: <BankThemedPair textKey={bank} theme="default" />,
          desktop: { x: 29, y: 0, w: 42 },
          mobile: { x: 29, y: 0, w: 42 },
        },
        {
          id: "alpha",
          node: <BankThemedPair textKey={bank} theme="alpha" />,
          desktop: { x: 0, y: 48, w: 44 },
          mobile: { x: 0, y: 48, w: 44 },
        },
        {
          id: "beta",
          node: <BankThemedPair textKey={bank} theme="beta" />,
          desktop: { x: 56, y: 48, w: 44 },
          mobile: { x: 56, y: 48, w: 44 },
        },
      ],
    },
    // 03 · Sobrescrituras por todas partes: editor con código Less + aviso flotante.
    {
      stage: { x: 6, w: 96, ratio: 1.6, mobileRatio: 1.6 },
      layers: [
        // Ventana centrada; la alerta, encima de su esquina de abajo a la derecha.
        { id: "devtools", node: <BankDevTools />, desktop: { x: 13, y: 4, w: 74 }, mobile: { x: 13, y: 4, w: 74 } },
        {
          id: "alert",
          node: <BankOverridesAlert textKey={bank} />,
          desktop: { x: 56, y: 66, w: 40 },
          mobile: { x: 56, y: 66, w: 40 },
        },
      ],
    },
  ];
}

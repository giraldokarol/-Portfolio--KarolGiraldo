// Punto único de GSAP: registra los plugins una sola vez y los reexporta.
// Importa siempre desde aquí ("@/lib/gsap"), nunca directamente desde "gsap".
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };

// Condiciones para gsap.matchMedia(): cada animación decide en cuál vive.
// Con "prefers-reduced-motion: reduce" no coincide ninguna → no se anima nada.
const motionOk = "(prefers-reduced-motion: no-preference)";

export const MEDIA = {
  // Ratón o trackpad: hay un puntero que seguir.
  pointer: `(hover: hover) and (pointer: fine) and ${motionOk}`,
  // Táctil (móvil, tablet): sin cursor, animación autónoma.
  touch: `(hover: none) and ${motionOk}, (pointer: coarse) and ${motionOk}`,
} as const;

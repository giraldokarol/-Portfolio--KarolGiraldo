import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, MEDIA } from "@/lib/gsap";

// Bolitas: cuánto se desplaza cada una (px) mientras la sección cruza la pantalla, en el orden de
// CaseQuestion.tsx. Velocidades distintas = sensación de profundidad.
const ORB_DRIFT = [-70, 50, -110];

// Entrada de "How might we…" (CaseQuestion.tsx), una sola vez al llegar con el scroll: la pregunta
// sube línea a línea desde una máscara. Las bolitas se desplazan a distinta velocidad con el scroll.
// Con reduced-motion no se anima nada: todo está en su sitio desde el principio.
export function useCaseQuestionReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        // Líneas medidas tal como quedan en cada idioma y pantalla; al terminar vuelve a ser texto normal.
        const split = SplitText.create(".case-question__title", {
          type: "lines",
          mask: "lines",
          linesClass: "case-question__line",
          aria: "auto",
        });

        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: { trigger: ".case-question__title", start: "top 78%", once: true },
          onComplete: () => split.revert(),
        });

        gsap.utils.toArray<HTMLElement>(".case-question__orb", section).forEach((orb, index) => {
          gsap.fromTo(
            orb,
            { y: -ORB_DRIFT[index] / 2 },
            {
              y: ORB_DRIFT[index] / 2,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope },
  );
}

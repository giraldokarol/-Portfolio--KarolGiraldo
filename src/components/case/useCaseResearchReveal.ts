import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, MEDIA } from "@/lib/gsap";

// Entrada de "Research" (CaseResearch.tsx), una sola vez al llegar con el scroll:
//   texto de la izquierda (etiqueta, título palabra a palabra, párrafos)
//   → huecos: en escritorio el bloque entero; en móvil cada hueco (número, frase y piezas una tras otra).
// Con reduced-motion no se anima nada: todo está en su sitio desde el principio.
export function useCaseResearchReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const $$ = (selector: string, parent: Element = section) => gsap.utils.toArray<HTMLElement>(selector, parent);

        const split = SplitText.create(".case-research__title", {
          type: "words",
          mask: "words",
          aria: "auto",
        });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".case-research__intro", start: "top 80%", once: true },
            onComplete: () => split.revert(),
          })
          .from(".case-research__label", { autoAlpha: 0, y: 12, duration: 0.6 }, 0)
          .from(split.words, { yPercent: 110, duration: 1, ease: "power4.out" }, 0.05)
          .from($$(".case-research__intro p"), { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.12 }, 0.4);

        return () => split.revert();
      });

      // Escritorio: los huecos están uno encima de otro y los cambia el scroll (useCaseResearchScroll):
      // aquí solo entra el bloque entero, sin tocar las piezas que anima el scroll.
      mm.add(MEDIA.large, () => {
        gsap.from(".case-research__gaps", {
          autoAlpha: 0,
          y: 60,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".case-research__gaps", start: "top 85%", once: true },
        });
      });

      // Móvil y tablet: huecos apilados, cada uno entra al llegar a él.
      mm.add(MEDIA.belowLarge, () => {
        gsap.utils.toArray<HTMLElement>(".case-research__gap", section).forEach((gap) => {
          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: { trigger: gap, start: "top 80%", once: true },
            })
            .from(gap.querySelector(".case-research__gap-number"), { autoAlpha: 0, x: -24, duration: 1 }, 0)
            .from(gap.querySelector(".case-research__gap-text"), { autoAlpha: 0, y: 16, duration: 0.8 }, 0.1)
            .from(gap.querySelectorAll(".case-research__piece"), { autoAlpha: 0, y: 40, duration: 1, stagger: 0.12, ease: "expo.out" }, 0.25);
        });
      });

      return () => mm.revert();
    },
    { scope },
  );
}

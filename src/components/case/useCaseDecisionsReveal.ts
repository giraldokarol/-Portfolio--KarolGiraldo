import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, MEDIA } from "@/lib/gsap";

// Entrada de "Key Decisions" (CaseDecisions.tsx), una sola vez al llegar con el scroll:
//   etiqueta → título palabra a palabra → flechas → el carrusel sube desde abajo.
// El cambio de tarjeta lo anima el CSS (transición del carril). Con reduced-motion no se anima nada.
export function useCaseDecisionsReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const split = SplitText.create(".case-decisions__title", {
          type: "words",
          mask: "words",
          aria: "auto",
        });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: section, start: "top 75%", once: true },
            onComplete: () => split.revert(),
          })
          .from(".case-decisions__label", { autoAlpha: 0, y: 12, duration: 0.6 }, 0)
          .from(split.words, { yPercent: 110, duration: 1, stagger: 0.08, ease: "power4.out" }, 0.05)
          .from(".case-decisions__controls", { autoAlpha: 0, x: 20, duration: 0.8 }, 0.3)
          .from(".case-decisions__viewport", { autoAlpha: 0, y: 70, duration: 1.1, ease: "expo.out" }, 0.3);

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope },
  );
}

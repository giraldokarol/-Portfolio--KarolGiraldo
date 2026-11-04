import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, ScrollTrigger, MEDIA } from "@/lib/gsap";

// Pantallas táctiles (sin hover): la foto de una etapa aparece cuando la etapa cruza el centro de la
// pantalla con el scroll, y se recoge al salir. Funciona también con reduced-motion (el CSS quita el
// movimiento y la foto simplemente aparece).
const TOUCH = "(hover: none), (pointer: coarse)";

// "Process" (CaseProcess.tsx):
//   - entrada, una sola vez al llegar con el scroll: etiqueta, título palabra a palabra, entradilla y las
//     etapas una tras otra;
//   - en táctil, activa la foto de la etapa que está en el centro de la pantalla (clase .is-active).
// Con reduced-motion no hay entrada: todo está en su sitio desde el principio.
export function useCaseProcessReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;
      const steps = gsap.utils.toArray<HTMLElement>(".case-process__step", section);

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const split = SplitText.create(".case-process__title", {
          type: "words",
          mask: "words",
          aria: "auto",
        });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: section, start: "top 80%", once: true },
            onComplete: () => split.revert(),
          })
          .from(".case-process__label", { autoAlpha: 0, y: 12, duration: 0.6 }, 0)
          .from(split.words, { yPercent: 110, duration: 1, ease: "power4.out" }, 0.05)
          .from(".case-process__lead", { autoAlpha: 0, y: 20, duration: 0.8 }, 0.4);

        // Lo que entra es el contenido de cada etapa, no la etapa: su foto (hover) no se toca.
        gsap.from(gsap.utils.toArray(".case-process__content", section), {
          autoAlpha: 0,
          y: 50,
          duration: 1,
          stagger: 0.14,
          ease: "expo.out",
          scrollTrigger: { trigger: ".case-process__steps", start: "top 85%", once: true },
        });

        return () => split.revert();
      });

      mm.add(TOUCH, () => {
        const triggers = steps.map((step) =>
          ScrollTrigger.create({
            trigger: step,
            start: "top 55%",
            end: "bottom 45%",
            toggleClass: "is-active",
          }),
        );
        return () => triggers.forEach((trigger) => trigger.kill());
      });

      return () => mm.revert();
    },
    { scope },
  );
}

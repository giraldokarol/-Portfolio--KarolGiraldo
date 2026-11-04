import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, MEDIA } from "@/lib/gsap";

// Entrada de "The problem / The solution" (CaseIntro.tsx), una sola vez al llegar con el scroll:
//   palabra de fondo → cada bloque (número, título palabra a palabra desde una máscara, entradilla y,
//   si lo hay, el párrafo en gris)
//   → tarjetas una tras otra.
// Con reduced-motion no se anima nada: todo está en su sitio desde el principio.
export function useCaseIntroReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const $$ = (selector: string, parent: Element = section) => gsap.utils.toArray<HTMLElement>(selector, parent);

        // Palabra de fondo: se desliza un poco con el scroll (parallax suave). Mide 108 % de la pantalla:
        // ±3,5 % de su ancho nunca deja hueco a los lados (useFitWord).
        gsap.fromTo(
          ".case-intro__bg-word",
          { xPercent: 3.5 },
          { xPercent: -3.5, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
        );

        const splits = $$(".case-intro__block").map((block, index) => {
          const split = SplitText.create(block.querySelector(".case-intro__title"), {
            type: "words",
            mask: "words",
            aria: "auto",
          });

          const tl = gsap.timeline({
              defaults: { ease: "power3.out" },
              // "The solution" empieza un poco después: llega a la vez, pero en escalera, como el diseño.
              delay: index * 0.15,
              scrollTrigger: { trigger: block, start: "top 80%", once: true },
              onComplete: () => split.revert(),
            })
            .from(block.querySelector(".case-intro__number"), { autoAlpha: 0, y: 12, duration: 0.6 }, 0)
            .from(split.words, { yPercent: 110, duration: 1, stagger: 0.08, ease: "power4.out" }, 0.05)
            .from(block.querySelector(".case-intro__lead"), { autoAlpha: 0, y: 20, duration: 0.8 }, 0.4);

          // Párrafo en gris (solo en algunos casos), un poco después de la entradilla.
          const detail = block.querySelector(".case-intro__detail");
          if (detail) tl.from(detail, { autoAlpha: 0, y: 20, duration: 0.8 }, 0.55);

          return split;
        });

        gsap.from($$(".case-intro__item"), {
          autoAlpha: 0,
          y: 70,
          duration: 1.1,
          stagger: 0.14,
          ease: "expo.out",
          scrollTrigger: { trigger: ".case-intro__cards", start: "top 85%", once: true },
        });

        return () => splits.forEach((split) => split.revert());
      });

      return () => mm.revert();
    },
    { scope },
  );
}

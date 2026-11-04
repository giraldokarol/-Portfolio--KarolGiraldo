import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, MEDIA } from "@/lib/gsap";

// Entrada de "(Context)" (CaseContext.tsx), una sola vez al llegar con el scroll:
//   etiqueta → título palabra a palabra desde una máscara → entradilla.
// El círculo (o las bolitas) de color sube un poco más despacio que la página (parallax suave).
// Con reduced-motion no se anima nada: todo está en su sitio desde el principio.
export function useCaseContextReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const split = SplitText.create(".case-context__title", {
          type: "words",
          mask: "words",
          aria: "auto",
        });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".case-context__title", start: "top 80%", once: true },
            onComplete: () => split.revert(),
          })
          .from(".case-context__label", { autoAlpha: 0, y: 12, duration: 0.6 }, 0)
          .from(split.words, { yPercent: 110, duration: 1, stagger: 0.06, ease: "power4.out" }, 0.05)
          .from(".case-context__lead", { autoAlpha: 0, y: 20, duration: 0.8 }, 0.5);

        gsap.fromTo(
          ".case-context__orb, .case-context__mesh-orb",
          { yPercent: 30 },
          { yPercent: -30, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } },
        );

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope },
  );
}

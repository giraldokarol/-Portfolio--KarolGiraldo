import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, MEDIA } from "@/lib/gsap";

// Entrada de la sección de contacto (una sola vez), en la misma línea que las demás secciones:
//   fondo → título (palabras desde una máscara) → texto → tarjeta (sube) → campos escalonados.
export function useContactReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const $ = (selector: string) => section.querySelector<HTMLElement>(selector)!;
        const split = SplitText.create($(".contact__title"), { type: "words", mask: "words", aria: "auto" });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "top 70%", once: true },
          onComplete: () => split.revert(), // el título vuelve a ser texto normal
        });

        tl.from($(".mesh-gradient"), { autoAlpha: 0, duration: 1.6, ease: "power2.out" }, 0)
          .from(split.words, { yPercent: 110, duration: 1, stagger: 0.08, ease: "power4.out" }, 0.1)
          .from($(".contact__lead"), { autoAlpha: 0, y: 16, duration: 0.8 }, 0.4)
          .from($(".contact__card"), { autoAlpha: 0, y: 60, scale: 0.97, duration: 1.2, ease: "expo.out" }, 0.25)
          .from(
            gsap.utils.toArray(".contact__reasons, .contact__field, .contact__submit", section),
            { autoAlpha: 0, y: 16, duration: 0.7, stagger: 0.08 },
            0.5,
          );

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope },
  );
}

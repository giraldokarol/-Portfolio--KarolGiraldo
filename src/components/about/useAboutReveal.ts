import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, MEDIA } from "@/lib/gsap";

// Entrada de "Behind the work": una coreografía que se reproduce una sola vez, cuando la sección
// empieza a entrar en pantalla. Misma línea que Selected work (useWorkReveal) y un guiño a Figma:
//   fondo → foto (sube) → aro de selección que se dibuja → círculos de color con rebote
//   → tiradores (línea desde el centro, luego cuadrado y círculos) → título (palabras desde una
//   máscara) → párrafos → botón.
export function useAboutReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const $ = (selector: string) => section.querySelector<HTMLElement>(selector)!;
        const $$ = (selector: string) => gsap.utils.toArray<Element>(selector, section);

        // Palabras del título, cada una dentro de su propia máscara (overflow oculto).
        const split = SplitText.create($(".about__title"), { type: "words", mask: "words", aria: "auto" });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "top 70%", once: true },
          // Al terminar se deshace la separación en palabras: el título vuelve a ser texto normal.
          onComplete: () => split.revert(),
        });

        tl.from($(".mesh-gradient"), { autoAlpha: 0, scale: 0.92, duration: 1.6, ease: "power2.out" }, 0)
          .from($(".about__portrait"), { autoAlpha: 0, y: 60, scale: 0.96, duration: 1.2, ease: "expo.out" }, 0.15)
          // El aro empieza a dibujarse arriba (-90°) y da la vuelta completa.
          .from($(".about__ring circle"), { drawSVG: "0%", rotate: -90, transformOrigin: "50% 50%", duration: 1.4, ease: "power2.inOut" }, 0.2)
          .from($$(".about__dot"), { scale: 0, duration: 0.9, stagger: 0.25, ease: "back.out(1.8)" }, 0.5)
          .from($(".about__handles-line"), { drawSVG: "50% 50%", duration: 0.7, ease: "power2.inOut" }, 0.9)
          .from(
            $$(".about__handles-square, .about__handles-knob, .about__handles-shadow"),
            { scale: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.05, ease: "back.out(2)" },
            1.3,
          )
          .from(split.words, { yPercent: 110, duration: 1, stagger: 0.08, ease: "power4.out" }, 0.25)
          .from($$(".about__body p"), { autoAlpha: 0, y: 20, duration: 0.8, stagger: 0.12 }, 0.55)
          .from($(".about__cta"), { autoAlpha: 0, y: 16, duration: 0.8 }, 0.8);

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope },
  );
}

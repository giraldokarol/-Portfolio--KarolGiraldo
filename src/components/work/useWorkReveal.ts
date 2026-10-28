import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, MEDIA } from "@/lib/gsap";

// Entrada de "Selected work": una coreografía escalonada que se reproduce una sola vez,
// cuando la sección empieza a entrar en pantalla (antes de fijarse con useWorkScroll).
//   fondo → título (palabras que suben desde una máscara) → marco (sube y crece) → subtítulo
//   → lista (proyectos escalonados + líneas que se dibujan) → descripción.
// No toca lo que anima el scroll (tamaño del marco y posición de los vídeos), así no se pisan.
export function useWorkReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const $ = (selector: string) => section.querySelector<HTMLElement>(selector)!;
        const title = $(".work__title");
        const frame = $(".work__screen > .work__frame");
        const items = gsap.utils.toArray<HTMLElement>(".work__item", section);

        // Palabras del título, cada una dentro de su propia máscara (overflow oculto).
        const split = SplitText.create(title, { type: "words", mask: "words", aria: "auto" });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
          // Al terminar se deshace la separación en palabras: el título vuelve a ser texto normal.
          onComplete: () => split.revert(),
        });

        tl.from($(".mesh-gradient"), { autoAlpha: 0, scale: 0.92, duration: 1.6, ease: "power2.out" }, 0)
          .from(split.words, { yPercent: 110, duration: 1, stagger: 0.08, ease: "power4.out" }, 0.1)
          .from(frame, { autoAlpha: 0, y: 80, scale: 0.9, duration: 1.3, ease: "expo.out" }, 0.2)
          .from($(".work__lead"), { autoAlpha: 0, y: 16, duration: 0.8 }, 0.35)
          .from(items, { autoAlpha: 0, x: 32, duration: 0.8, stagger: 0.08 }, 0.45)
          // Inicio y final explícitos: la variable CSS no tiene valor propio en el elemento.
          .fromTo(items, { "--work-line": 0 }, { "--work-line": 1, duration: 1, stagger: 0.08, ease: "power2.inOut" }, 0.5)
          .from($(".work__descriptions"), { autoAlpha: 0, y: 16, duration: 0.8 }, 0.6);

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope },
  );
}

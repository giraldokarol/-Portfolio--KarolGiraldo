import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, MEDIA } from "@/lib/gsap";

// Entrada del Hero de un caso de estudio, al llegar a la página (una sola vez):
//   manchas de color → letras del título (suben desde una máscara) → entradilla → ficha → ventana del vídeo.
// Hasta que empieza, el CSS los tiene ocultos (.case-hero:not(.is-ready)); con reduced-motion se ven quietos.
export function useCaseHeroReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const hero = scope.current;
      if (!hero) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const $ = (selector: string) => hero.querySelector<HTMLElement>(selector)!;

        // Letras del título, agrupadas por palabras: cada palabra es una máscara (overflow oculto)
        // y sus letras suben desde abajo. Los lectores de pantalla siguen leyendo el título entero.
        const split = SplitText.create($(".case-hero__title"), { type: "words, chars", mask: "words", aria: "auto" });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          // Al terminar, el título vuelve a ser texto normal.
          onComplete: () => split.revert(),
        });

        tl.from($(".case-hero__backdrop"), { autoAlpha: 0, duration: 1.6, ease: "power2.out" }, 0)
          .from(split.chars, { yPercent: 110, duration: 1, stagger: 0.022, ease: "power4.out" }, 0.15)
          .from($(".case-hero__lead"), { autoAlpha: 0, y: 20, duration: 0.9 }, 0.65)
          .from(hero.querySelectorAll(".case-hero__detail"), { autoAlpha: 0, y: 12, duration: 0.7, stagger: 0.08 }, 0.8)
          .from($(".case-hero__window"), { autoAlpha: 0, y: 80, duration: 1.3, ease: "expo.out" }, 0.75);

        // Los elementos ya están en su punto de partida: se pueden mostrar.
        hero.classList.add("is-ready");

        return () => split.revert();
      });

      // Sin animación (reduced-motion): se muestran tal cual.
      hero.classList.add("is-ready");

      return () => mm.revert();
    },
    { scope },
  );
}

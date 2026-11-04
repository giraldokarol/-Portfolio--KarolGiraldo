import type { RefObject } from "react";

import { gsap, useGSAP, MEDIA } from "@/lib/gsap";

// "Research" con scroll, solo en escritorio: la sección se queda fija (pin) con el texto a la izquierda
// y el scroll pasa de un hueco al siguiente (01 → 02 → 03) en el mismo sitio. En cada cambio:
//   - el hueco actual sale hacia arriba: número a la izquierda, frase y piezas una tras otra;
//   - el siguiente entra desde abajo, en el mismo orden.
// Además, los círculos de color de "Selected work" aparecen cuando "(Context)" sale de la pantalla.
// Los huecos solo se desvanecen (opacity, no visibility): los lectores de pantalla siguen leyendo los tres.
// En móvil, tablet y con reduced-motion no hay pin: los huecos están apilados (estilos por defecto).
const STEP = 1; // duración de cada cambio de hueco en la línea de tiempo
const HOLD = 0.4; // pausa al principio y al final para ver el primer y el último hueco
// Pausa entre dos cambios: los huecos del medio se quedan quietos un rato para poder leerlos
// (sin ella, el 02 empezaba a salir en cuanto terminaba de entrar).
const PAUSE = 1.2;
const SCROLL_PER_STEP = 0.8; // pantallas de scroll por cada unidad de la línea de tiempo (= cada cambio)

export function useCaseResearchScroll(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.large, () => {
        const inner = section.querySelector<HTMLElement>(".case-research__inner")!;
        const gaps = gsap.utils.toArray<HTMLElement>(".case-research__gap", section);
        const parts = (gap: HTMLElement) => ({
          number: gap.querySelector(".case-research__gap-number"),
          text: gap.querySelector(".case-research__gap-text"),
          pieces: gap.querySelectorAll(".case-research__piece"),
        });
        const mesh = section.querySelector(".case-research__mesh");
        const transitions = gaps.length - 1;
        const total = HOLD * 2 + transitions * STEP + (transitions - 1) * PAUSE;

        // Los huecos pasan a ocupar el mismo sitio (estilos .is-pinned); solo el primero se ve.
        section.classList.add("is-pinned");
        gaps.slice(1).forEach((gap) => {
          const { number, text, pieces } = parts(gap);
          gsap.set([number, text, ...pieces], { opacity: 0 });
        });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: STEP * 0.5 },
          scrollTrigger: {
            trigger: inner,
            // Centrada en el hueco que deja el header (algo más abajo que el centro de la pantalla).
            start: "center 54%",
            // Scroll proporcional a la línea de tiempo: los cambios van a la misma velocidad y las pausas suman scroll.
            end: () => `+=${window.innerHeight * SCROLL_PER_STEP * (total - HOLD * 2)}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Círculos de color: aparecen mientras "(Context)" se va por arriba y luego suben despacio.
        tl.fromTo(mesh, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0.1).fromTo(
          mesh,
          { y: 40 },
          { y: -40, duration: total, ease: "none" },
          0,
        );

        gaps.slice(1).forEach((next, i) => {
          const at = HOLD + i * (STEP + PAUSE);
          const out = parts(gaps[i]);
          const into = parts(next);

          tl.to(out.number, { opacity: 0, xPercent: -20 }, at)
            .to(out.text, { opacity: 0, y: -24 }, at)
            .to(out.pieces, { opacity: 0, y: -60, stagger: 0.05 }, at)
            .fromTo(into.number, { opacity: 0, xPercent: 20 }, { opacity: 1, xPercent: 0 }, at + STEP * 0.4)
            .fromTo(into.text, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, at + STEP * 0.45)
            .fromTo(into.pieces, { opacity: 0, y: 80 }, { opacity: 1, y: 0, stagger: 0.08 }, at + STEP * 0.5);
        });
        tl.set({}, {}, total); // pausa final antes de soltar la sección

        return () => section.classList.remove("is-pinned");
      });

      return () => mm.revert();
    },
    { scope },
  );
}

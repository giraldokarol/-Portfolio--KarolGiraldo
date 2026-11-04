import type { RefObject } from "react";

import { gsap, useGSAP, SplitText, MEDIA } from "@/lib/gsap";

// Entrada de "Final Thoughts" (CaseFinal.tsx), una sola vez al llegar con el scroll:
//   etiqueta → título palabra a palabra → tarjetas una tras otra → las cifras cuentan desde 0
//   y el lápiz se dibuja.
// Con reduced-motion no se anima nada: todo está en su sitio y las cifras ya en su valor.
export function useCaseFinalReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        const $$ = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, section);

        const split = SplitText.create(".case-final__title", {
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
          .from(".case-final__label", { autoAlpha: 0, y: 12, duration: 0.6 }, 0)
          .from(split.words, { yPercent: 110, duration: 1, stagger: 0.08, ease: "power4.out" }, 0.05);

        const cards = gsap
          .timeline({ scrollTrigger: { trigger: ".case-final__bento", start: "top 80%", once: true } })
          .from($$(".case-final__card"), { autoAlpha: 0, y: 60, duration: 1, stagger: 0.09, ease: "expo.out" });

        // Cifras: de 0 a su valor (el número real está en el HTML; aquí solo se anima). Si el valor lleva
        // ceros delante, los conserva ("04" cuenta 00, 01… 04; "15", 0, 1… 15). Al deshacer, vuelve el valor real.
        const values = $$(".case-final__stat-value").map((value) => ({ value, text: value.textContent ?? "" }));
        values.forEach(({ value, text }) => {
          const target = Number(text);
          if (!Number.isFinite(target)) return;
          const digits = text.startsWith("0") ? text.length : 0;
          const show = (n: number) => (value.textContent = String(Math.round(n)).padStart(digits, "0"));
          const count = { n: 0 };
          show(0);
          cards.to(count, { n: target, duration: 1.6, ease: "power2.out", onUpdate: () => show(count.n) }, 0.3);
        });

        cards.from(".case-final__pencil path", { drawSVG: "0%", duration: 1.2, stagger: 0.2, ease: "power2.inOut" }, 0.6);

        return () => {
          split.revert();
          values.forEach(({ value, text }) => (value.textContent = text));
        };
      });

      return () => mm.revert();
    },
    { scope },
  );
}

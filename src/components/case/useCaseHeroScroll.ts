import type { RefObject } from "react";

import { gsap, useGSAP, MEDIA } from "@/lib/gsap";

// Hero de un caso de estudio (CaseHero.tsx):
// - el marco del vídeo crece un poco (de 90 % a 100 %) mientras el scroll lo descubre;
// - el vídeo solo se reproduce mientras se ve.
// Con reduced-motion: ventana a tamaño real y vídeo parado en su portada.
export function useCaseHeroScroll(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const frame = scope.current?.querySelector<HTMLElement>(".case-hero__frame");
      const video = scope.current?.querySelector<HTMLVideoElement>(".case-hero__video");
      if (!frame || !video) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        gsap.fromTo(
          frame,
          { scale: 0.9 },
          {
            scale: 1,
            ease: "none",
            // Desde lo alto de la página hasta que el marco se ve entero.
            scrollTrigger: { trigger: frame, start: 0, end: "bottom bottom", scrub: 0.6 },
          },
        );

        const observer = new IntersectionObserver((entries) => {
          if (entries[entries.length - 1].isIntersecting) video.play().catch(() => {}); // el navegador puede bloquearlo
          else video.pause();
        });
        observer.observe(video);

        return () => {
          observer.disconnect();
          video.pause();
        };
      });

      return () => mm.revert();
    },
    { scope },
  );
}

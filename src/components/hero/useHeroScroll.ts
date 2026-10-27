import type { RefObject } from "react";

import { useGSAP } from "@/lib/gsap";

// EN CONSTRUCCIÓN (parte 3): aquí irá la transición escena 1 → escena 2 con ScrollTrigger
// (pin + scrub, caja de selección, muñeca que se encoge, título que se escribe).
// Por ahora solo marca el hero como listo para que el CSS deje de ocultar el contenido.
export function useHeroScroll(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      scope.current?.classList.add("is-ready");
    },
    { scope },
  );
}

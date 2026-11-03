import { useEffect, type RefObject } from "react";

// Margen entre la ficha y el borde inferior de la pantalla al entrar.
const BOTTOM_GAP = 56;
// Nunca más arriba que esto respecto a la parte de arriba del vídeo.
const MIN_OFFSET = 24;

// Ficha del proyecto a la derecha del vídeo (pantallas anchas): lo más abajo posible sin que se corte
// al entrar. Depende del alto de la pantalla y de lo que ocupe el título, así que se mide aquí y se pasa
// al CSS como --details-offset (styles/sections/_case-hero.scss). Se recalcula al cambiar el tamaño.
export function useCaseHeroDetails(scope: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const frame = scope.current?.querySelector<HTMLElement>(".case-hero__frame");
    const details = scope.current?.querySelector<HTMLElement>(".case-hero__details");
    if (!frame || !details) return;

    const place = () => {
      const frameTop = frame.getBoundingClientRect().top + window.scrollY; // posición en la página
      const space = window.innerHeight - frameTop - details.offsetHeight - BOTTOM_GAP;
      details.style.setProperty("--details-offset", `${Math.max(MIN_OFFSET, space)}px`);
    };

    place();
    const observer = new ResizeObserver(place); // cambia el ancho de la pantalla o el alto del título
    observer.observe(scope.current!);
    window.addEventListener("resize", place);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [scope]);
}

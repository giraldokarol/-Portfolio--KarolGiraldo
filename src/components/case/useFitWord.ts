import { useEffect, type RefObject } from "react";

// Ancho de la palabra respecto a la pantalla: algo más del 100 % para que, al deslizarse con el scroll
// (useCaseIntroReveal, ±3,5 % de su ancho), sus bordes nunca dejen hueco a los lados.
const WIDTH = 1.08;

// Palabra gigante de fondo ("Problem", "Problème", "Problema"…): ajusta su tamaño de letra para que
// ocupe todo el ancho de la pantalla, sea cual sea el idioma. Se recalcula al cambiar el tamaño
// de la pantalla y cuando termina de cargar la fuente.
export function useFitWord(scope: RefObject<HTMLElement | null>, selector: string) {
  useEffect(() => {
    const word = scope.current?.querySelector<HTMLElement>(selector);
    if (!word) return;

    const fit = () => {
      word.style.fontSize = ""; // vuelve al tamaño del CSS para medir
      const size = parseFloat(getComputedStyle(word).fontSize);
      const width = word.getBoundingClientRect().width;
      if (width) word.style.fontSize = `${(size * window.innerWidth * WIDTH) / width}px`;
    };

    fit();
    document.fonts.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [scope, selector]);
}

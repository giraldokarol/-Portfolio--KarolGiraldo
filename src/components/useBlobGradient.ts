import type { RefObject } from "react";

import { gsap, useGSAP, MEDIA } from "@/lib/gsap";

// Cada mancha del gradiente (styles/components/_blobs.scss → .blob--*).
// range: cuánto se desplaza como fracción del ancho/alto de la pantalla.
// lag: segundos que tarda en alcanzar al puntero (distinto = efecto líquido).
const BLOBS = [
  { selector: ".blob--yellow", range: 0.34, lag: 0.9, drift: { x: 0.06, y: 0.05, duration: 9 } },
  { selector: ".blob--blue", range: 0.24, lag: 1.3, drift: { x: -0.05, y: -0.06, duration: 11 } },
];

// Mueve una mancha escribiendo sus variables CSS --blob-x / --blob-y en píxeles.
function createBlob(el: HTMLElement) {
  const position = { x: 0, y: 0 };
  const render = () => {
    el.style.setProperty("--blob-x", `${position.x}px`);
    el.style.setProperty("--blob-y", `${position.y}px`);
  };
  return { position, render };
}

// Manchas de color (amarilla y azul) que se mueven, como en el Hero. Se usan en el Hero y en la página legal.
// - con ratón: siguen al puntero con retraso suave (gsap.quickTo);
// - en táctil: deriva lenta y autónoma;
// - con reduced-motion: quietas (ninguna condición de MEDIA coincide).
// Solo trabajan mientras su contenedor (scope) está en pantalla.
export function useBlobGradient(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const container = scope.current;
      if (!container) return;

      const blobs = BLOBS.map((config) => ({
        config,
        ...createBlob(container.querySelector<HTMLElement>(config.selector)!),
      }));

      // Al salir de una condición (p. ej. se activa reduced-motion) las manchas vuelven al centro.
      const reset = () =>
        blobs.forEach(({ position, render }) => {
          position.x = 0;
          position.y = 0;
          render();
        });

      const mm = gsap.matchMedia();

      mm.add(MEDIA.pointer, () => {
        const movers = blobs.map(({ config, position, render }) => ({
          range: config.range,
          x: gsap.quickTo(position, "x", { duration: config.lag, ease: "power3.out", onUpdate: render }),
          y: gsap.quickTo(position, "y", { duration: config.lag, ease: "power3.out", onUpdate: render }),
        }));

        let visible = true;
        // El navegador puede agrupar varios avisos (p. ej. al fijar el Hero con ScrollTrigger se saca y se vuelve
        // a poner en la página): manda el más reciente, no el primero.
        const observer = new IntersectionObserver((entries) => (visible = entries[entries.length - 1].isIntersecting));
        observer.observe(container);

        // Puntero normalizado de −0,5 a 0,5 desde el centro de la pantalla.
        const onMove = (event: PointerEvent) => {
          if (!visible || event.pointerType !== "mouse") return;
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          movers.forEach(({ range, x, y }) => {
            x(nx * range * window.innerWidth);
            y(ny * range * window.innerHeight);
          });
        };

        // El puntero sale de la ventana → las manchas vuelven a su sitio.
        const onLeave = () => movers.forEach(({ x, y }) => (x(0), y(0)));

        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);

        return () => {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("pointerleave", onLeave);
          observer.disconnect();
          reset();
        };
      });

      mm.add(MEDIA.touch, () => {
        const timelines = blobs.map(({ config, position, render }) =>
          gsap.to(position, {
            x: () => config.drift.x * window.innerWidth,
            y: () => config.drift.y * window.innerHeight,
            duration: config.drift.duration,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            onUpdate: render,
          }),
        );

        // Pausa la deriva cuando el contenedor no se ve (ahorra batería).
        const observer = new IntersectionObserver((entries) => {
          const visible = entries[entries.length - 1].isIntersecting; // el aviso más reciente
          timelines.forEach((tl) => (visible ? tl.resume() : tl.pause()));
        });
        observer.observe(container);

        return () => {
          observer.disconnect();
          reset();
        };
      });

      return () => mm.revert();
    },
    { scope },
  );
}

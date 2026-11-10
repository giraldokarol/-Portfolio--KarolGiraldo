import type { RefObject } from "react";

import { gsap, useGSAP, MEDIA } from "@/lib/gsap";

// Capas de la muñeca de la 404 (ids de Figma en assets/errors/avatar-404.svg) y cuánto se mueven al mirar.
// Valores en unidades del SVG (viewBox 394 × 421). Como en el avatar de la home (hero/useHeroAvatar.ts):
// los ojos se mueven con la cara y además un poco más; el pelo va al revés (está "detrás").
// lag: segundos hasta alcanzar al puntero → capas con distinto retraso = profundidad.
const LAYERS = [
  { id: "Hair", move: -6, lag: 0.9 },
  { id: "neck", move: 2, lag: 0.7 },
  { id: "left hand", move: 3, lag: 0.65 },
  { id: "right hand", move: 3, lag: 0.65 },
  { id: "Face", move: 7, lag: 0.6 }, // incluye orejas, flequillo, nariz y boca
  { id: "eye-right", move: 1.5, lag: 0.45 },
  { id: "eye-left", move: 1.5, lag: 0.45 },
  { id: "eyeball-right", move: 4, lag: 0.3 },
  { id: "eyeball-left", move: 4, lag: 0.3 },
] as const;

const TILT = 3; // grados máximos de inclinación
const NECK_POINT = "203 330"; // punto de giro (base del cuello, en unidades del SVG)
const BLINK = { min: 1.2, max: 3.5, double: 0.2 }; // segundos entre parpadeos, probabilidad de doble
const LOOK_AROUND = { min: 1.8, max: 4.5 }; // táctil: cada cuánto mira a otro sitio

// Muñeca de la 404 viva:
// - con ratón: sigue al cursor por capas (parallax) + parpadeo aleatorio;
// - en táctil: mira a su alrededor sola + parpadeo;
// - con reduced-motion (o si enabled = false): quieta.
export function useErrorAvatar(scope: RefObject<HTMLElement | null>, enabled: boolean) {
  useGSAP(
    () => {
      const box = scope.current;
      const svg = box?.querySelector("svg");
      if (!enabled || !box || !svg) return;
      const q = (id: string) => svg.querySelector<SVGGElement>(`[id="${id}"]`)!;
      const body = q("Avatar");

      // lookAt(nx, ny) con nx, ny entre −1 y 1.
      const createLook = () => {
        const movers = LAYERS.map(({ id, move, lag }) => ({
          move,
          x: gsap.quickTo(q(id), "x", { duration: lag, ease: "power3.out" }),
          y: gsap.quickTo(q(id), "y", { duration: lag, ease: "power3.out" }),
        }));
        gsap.set(body, { svgOrigin: NECK_POINT });
        const tilt = gsap.quickTo(body, "rotation", { duration: 0.8, ease: "power3.out" });

        return (nx: number, ny: number) => {
          movers.forEach(({ move, x, y }) => {
            x(nx * move);
            y(ny * move);
          });
          tilt(nx * TILT);
        };
      };

      // Parpadeo: aplasta los ojos en vertical un instante, a intervalos aleatorios.
      const startBlinking = () => {
        const eyes = [q("eyeball-right"), q("eyeball-left")];
        gsap.set(eyes, { transformOrigin: "50% 50%" });
        let next: gsap.core.Tween;
        const blink = () => {
          if (!document.hidden) {
            const tl = gsap.timeline();
            tl.to(eyes, { scaleY: 0.1, duration: 0.07, ease: "power2.in" }).to(eyes, {
              scaleY: 1,
              duration: 0.1,
              ease: "power2.out",
            });
            if (Math.random() < BLINK.double) {
              tl.to(eyes, { scaleY: 0.1, duration: 0.07, ease: "power2.in" }, "+=0.08").to(eyes, {
                scaleY: 1,
                duration: 0.1,
                ease: "power2.out",
              });
            }
          }
          next = gsap.delayedCall(gsap.utils.random(BLINK.min, BLINK.max), blink);
        };
        next = gsap.delayedCall(gsap.utils.random(1, 2.5), blink);
        return () => next?.kill();
      };

      const mm = gsap.matchMedia();

      mm.add(MEDIA.pointer, () => {
        const lookAt = createLook();
        const stopBlinking = startBlinking();

        // Cursor respecto al centro de la muñeca, normalizado a −1…1 por media pantalla.
        const onMove = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") return;
          const rect = box.getBoundingClientRect();
          const nx = (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
          const ny = (event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
          lookAt(gsap.utils.clamp(-1, 1, nx), gsap.utils.clamp(-1, 1, ny));
        };
        const onLeave = () => lookAt(0, 0);

        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);

        return () => {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("pointerleave", onLeave);
          stopBlinking();
        };
      });

      mm.add(MEDIA.touch, () => {
        const lookAt = createLook();
        const stopBlinking = startBlinking();

        // Sin cursor: mira a puntos al azar (buscando el camino) y a veces vuelve al frente.
        let next: gsap.core.Tween;
        const lookAround = () => {
          const front = Math.random() < 0.3;
          lookAt(front ? 0 : gsap.utils.random(-0.8, 0.8), front ? 0 : gsap.utils.random(-0.5, 0.6));
          next = gsap.delayedCall(gsap.utils.random(LOOK_AROUND.min, LOOK_AROUND.max), lookAround);
        };
        next = gsap.delayedCall(1, lookAround);

        return () => {
          next?.kill();
          stopBlinking();
        };
      });

      return () => mm.revert();
    },
    { scope, dependencies: [enabled] },
  );
}

import type { RefObject } from "react";

import { gsap, useGSAP, MEDIA } from "@/lib/gsap";

// Capas de la muñeca (data-part de Avatar.tsx) y cuánto se mueven al mirar.
// Valores en unidades del SVG (viewBox 356 × 380). Están anidadas: los ojos se mueven
// con la cara y además un poco más, así que su recorrido total es face + eyeball.
// lag: segundos hasta alcanzar al puntero → capas con distinto retraso = profundidad.
// Cabeza = cara + orejas (se mueven juntas para no despegarse).
const LAYERS = [
  { part: "hair-back", move: -10, lag: 0.9 }, // contrario: está "detrás"
  { part: "neck", move: 2.5, lag: 0.7 },
  { part: "ears", move: 7, lag: 0.6 },
  { part: "face", move: 7, lag: 0.6 }, // incluye el flequillo
  { part: "eye-right", move: 1.5, lag: 0.45 },
  { part: "eye-left", move: 1.5, lag: 0.45 },
  { part: "eyeball-right", move: 4, lag: 0.3 },
  { part: "eyeball-left", move: 4, lag: 0.3 },
] as const;

// Las formas de cada máscara siguen a su capa, pero la máscara vive dentro de la capa que oculta
// (pelo o cuello), que también se mueve: su desplazamiento es capa − contenedor.
const MASKS = [
  { part: "mask-face", follows: "face", inside: "hair-back" },
  { part: "mask-ears", follows: "ears", inside: "hair-back" },
  { part: "mask-neck", follows: "neck", inside: "hair-back" },
  { part: "mask-neck-face", follows: "face", inside: "neck" },
] as const;

const HEAD_TILT = 4; // grados máximos de inclinación de la cabeza
const NECK_POINT = "178 300"; // punto de giro de la cabeza (base del cuello, en unidades SVG)

const BLINK = { min: 1.2, max: 3.5, double: 0.2 }; // segundos entre parpadeos, probabilidad de doble
const LOOK_AROUND = { min: 1.8, max: 4.5 }; // móvil: cada cuánto mira a otro sitio

// Muñeca viva:
// - con ratón: sigue al puntero por capas (parallax) + parpadeo aleatorio;
// - en táctil: mira a su alrededor sola + parpadeo;
// - con reduced-motion: quieta.
// Solo trabaja mientras el hero está en pantalla.
export function useHeroAvatar(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const svg = scope.current?.querySelector<SVGSVGElement>(".hero__avatar");
      if (!svg) return;
      const q = (part: string) => svg.querySelector<SVGGElement>(`[data-part="${part}"]`)!;
      const girl = q("girl");

      let visible = true;
      const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      observer.observe(svg);

      // Crea los "movedores" de cada capa: lookAt(nx, ny) con nx, ny entre −1 y 1.
      const createLook = () => {
        const movers = LAYERS.map(({ part, move, lag }) => ({
          move,
          x: gsap.quickTo(q(part), "x", { duration: lag, ease: "power3.out" }),
          y: gsap.quickTo(q(part), "y", { duration: lag, ease: "power3.out" }),
        }));
        const tilt = gsap.quickTo(girl, "rotation", { duration: 0.8, ease: "power3.out" });
        gsap.set(girl, { svgOrigin: NECK_POINT });

        // Cada fotograma, las formas de cada máscara copian su capa (menos su contenedor).
        const syncMasks = MASKS.map(({ part, follows, inside }) => ({
          setX: gsap.quickSetter(q(part), "x"),
          setY: gsap.quickSetter(q(part), "y"),
          layer: q(follows),
          container: q(inside),
        }));
        const offset = (layer: Element, container: Element, axis: "x" | "y") =>
          (gsap.getProperty(layer, axis) as number) - (gsap.getProperty(container, axis) as number);
        const onTick = () =>
          syncMasks.forEach(({ setX, setY, layer, container }) => {
            setX(offset(layer, container, "x"));
            setY(offset(layer, container, "y"));
          });
        gsap.ticker.add(onTick);

        const lookAt = (nx: number, ny: number) => {
          movers.forEach(({ move, x, y }) => {
            x(nx * move);
            y(ny * move);
          });
          tilt(nx * HEAD_TILT);
        };
        const stop = () => gsap.ticker.remove(onTick);
        return { lookAt, stop };
      };

      // Parpadeo: aplasta los ojos en vertical un instante, a intervalos aleatorios.
      const startBlinking = () => {
        const eyes = [q("eyeball-right"), q("eyeball-left")];
        gsap.set(eyes, { transformOrigin: "50% 50%" });
        let next: gsap.core.Tween;
        const blink = () => {
          if (visible && !document.hidden) {
            const tl = gsap.timeline();
            tl.to(eyes, { scaleY: 0.1, duration: 0.07, ease: "power2.in" })
              .to(eyes, { scaleY: 1, duration: 0.1, ease: "power2.out" });
            if (Math.random() < BLINK.double) {
              tl.to(eyes, { scaleY: 0.1, duration: 0.07, ease: "power2.in" }, "+=0.08")
                .to(eyes, { scaleY: 1, duration: 0.1, ease: "power2.out" });
            }
          }
          next = gsap.delayedCall(gsap.utils.random(BLINK.min, BLINK.max), blink);
        };
        next = gsap.delayedCall(gsap.utils.random(1, 2.5), blink);
        return () => next?.kill();
      };

      const mm = gsap.matchMedia();

      mm.add(MEDIA.pointer, () => {
        const { lookAt, stop } = createLook();
        const stopBlinking = startBlinking();

        // Puntero respecto al centro del avatar, normalizado a −1…1 por media pantalla.
        const onMove = (event: PointerEvent) => {
          if (!visible || event.pointerType !== "mouse") return;
          const box = svg.getBoundingClientRect();
          const nx = (event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2);
          const ny = (event.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2);
          lookAt(gsap.utils.clamp(-1, 1, nx), gsap.utils.clamp(-1, 1, ny));
        };
        const onLeave = () => lookAt(0, 0);

        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);

        return () => {
          window.removeEventListener("pointermove", onMove);
          document.documentElement.removeEventListener("pointerleave", onLeave);
          stop();
          stopBlinking();
        };
      });

      mm.add(MEDIA.touch, () => {
        const { lookAt, stop } = createLook();
        const stopBlinking = startBlinking();

        // Sin cursor: mira a puntos al azar y a veces vuelve al frente.
        let next: gsap.core.Tween;
        const lookAround = () => {
          if (visible) {
            const front = Math.random() < 0.3;
            lookAt(front ? 0 : gsap.utils.random(-0.8, 0.8), front ? 0 : gsap.utils.random(-0.5, 0.6));
          }
          next = gsap.delayedCall(gsap.utils.random(LOOK_AROUND.min, LOOK_AROUND.max), lookAround);
        };
        next = gsap.delayedCall(1, lookAround);

        return () => {
          next?.kill();
          stop();
          stopBlinking();
        };
      });

      return () => {
        mm.revert();
        observer.disconnect();
      };
    },
    { scope },
  );
}

import type { RefObject } from "react";

import { gsap, useGSAP, ScrollTrigger, SplitText, MEDIA } from "@/lib/gsap";

// Escena 1 → escena 2 con el scroll ("el lienzo de Figma", docs/hero-spec.md §6).
// El HTML es la escena 2; la escena 1 es el estado inicial que se calcula aquí (técnica FLIP).
//
// Progreso del scroll (0 → 1):
//   0,00–0,10  aparece la caja de selección (morada, como en Figma) con sus medidas
//   0,10–0,45  guías de centro mientras la muñeca se mueve
//   0,12–0,45  la muñeca se encoge de 355 × 380 a su tamaño final y sube
//   0,45       la caja de selección desaparece de golpe (deseleccionar)
//   0,45–0,75  el saludo y "Product Designer" se escriben letra a letra con el cursor de texto
//   0,76–0,92  cada letra de "Product Designer" pasa de contorno a relleno azul (y el contorno se retira)
//   0,86–0,94  aparece el subtítulo
const SCENES = {
  wide: { scale: 355.31 / 206.29, centerY: 0.515, length: 1.5 }, // medidas de Figma
  narrow: { scale: 1.6, centerY: 0.47, length: 1 },
};

export function useHeroScroll(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const hero = scope.current;
      if (!hero) return;
      const $ = <T extends Element>(selector: string) => hero.querySelector<T>(selector)!;

      const content = $<HTMLElement>(".hero__content");
      const avatar = $<SVGSVGElement>(".hero__avatar");
      const title = $<HTMLElement>(".hero__title");
      const greeting = $<HTMLElement>(".hero__greeting");
      const role = $<HTMLElement>(".hero__role");
      const subtitle = $<HTMLElement>(".hero__subtitle");
      const selection = $<HTMLElement>(".hero__selection");
      const frame = $<SVGRectElement>(".hero__selection-frame rect");
      const handles = hero.querySelectorAll<HTMLElement>(".hero__handle");
      const sizeLabel = $<HTMLElement>(".hero__selection-size");
      const guides = hero.querySelectorAll<SVGSVGElement>(".hero__selection-guides, .hero__selection-center");
      const center = $<SVGSVGElement>(".hero__selection-center");
      const caret = $<HTMLElement>(".hero__caret");

      const mm = gsap.matchMedia();

      mm.add({ wide: MEDIA.wide, narrow: MEDIA.narrow }, (context) => {
        const scene = context.conditions?.wide ? SCENES.wide : SCENES.narrow;
        const primary = getComputedStyle(hero).getPropertyValue("--color-primary").trim();
        // Mismo azul pero transparente: el relleno va de aquí al azul sin pasar por gris.
        const [r, g, b] = gsap.utils.splitColor(primary) as number[];
        const primaryClear = `rgba(${r}, ${g}, ${b}, 0)`;

        // Posición de un elemento relativa al contenido del hero (donde viven caja y cursor).
        const relative = (rect: DOMRect) => {
          const base = content.getBoundingClientRect();
          return { left: rect.left - base.left, top: rect.top - base.top, width: rect.width, height: rect.height };
        };

        // FLIP: cuánto hay que mover la muñeca desde su sitio (escena 2) hasta el centro (escena 1).
        // El centro "natural" es el que se ve menos el desplazamiento que ya tenga aplicado.
        const naturalCenter = () => {
          const box = avatar.getBoundingClientRect();
          return {
            x: box.left + box.width / 2 - (gsap.getProperty(avatar, "x") as number),
            y: box.top + box.height / 2 - (gsap.getProperty(avatar, "y") as number),
          };
        };
        const heroBox = () => hero.getBoundingClientRect();
        const flipX = () => heroBox().left + heroBox().width / 2 - naturalCenter().x;
        const flipY = () => heroBox().top + heroBox().height * scene.centerY - naturalCenter().y;

        // La caja de selección enmarca la muñeca en cada fotograma y muestra sus medidas reales.
        const syncSelection = () => {
          const box = relative(avatar.getBoundingClientRect());
          gsap.set(selection, { x: box.left, y: box.top, width: box.width, height: box.height });
          sizeLabel.textContent = `${Math.round(box.width)} × ${Math.round(box.height)}`;
        };

        // SplitText separa el título en letras. autoSplit lo rehace si cambia el ancho o carga la
        // fuente, y como devolvemos la animación desde onSplit, se reconstruye sola sin saltos.
        const split = SplitText.create(title, {
          type: "words,chars",
          autoSplit: true,
          aria: "auto", // el h1 conserva su texto completo para lectores de pantalla
          onSplit(self) {
            const greetingChars = (self.chars as HTMLElement[]).filter((char) => greeting.contains(char));
            const roleChars = (self.chars as HTMLElement[]).filter((char) => role.contains(char));

            // Escritura: cuántas letras de cada parte se ven, y el cursor detrás de la última.
            const typed = { greeting: 0, role: 0 };
            const renderTyping = () => {
              const g = Math.round(typed.greeting);
              const r = Math.round(typed.role);
              greetingChars.forEach((char, i) => (char.style.visibility = i < g ? "visible" : "hidden"));
              roleChars.forEach((char, i) => (char.style.visibility = i < r ? "visible" : "hidden"));

              const last = r > 0 ? roleChars[r - 1] : g > 0 ? greetingChars[g - 1] : null;
              const anchor = last ?? greetingChars[0];
              const box = relative(anchor.getBoundingClientRect());
              gsap.set(caret, {
                x: last ? box.left + box.width + 4 : box.left - 4,
                y: box.top + box.height * 0.12,
                height: box.height * 0.76,
              });
            };

            gsap.set(roleChars, { color: primaryClear }); // solo contorno (CSS: text-stroke)
            gsap.set(subtitle, { autoAlpha: 0, y: 24 });
            gsap.set(frame, { drawSVG: "0%" });
            gsap.set(handles, { scale: 0 });
            gsap.set(guides, { autoAlpha: 0 });
            renderTyping();

            const tl = gsap.timeline({
              defaults: { ease: "none" },
              // En cada fotograma (también mientras el scrub suaviza), la caja sigue a la muñeca.
              onUpdate: syncSelection,
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: () => `+=${window.innerHeight * scene.length}`,
                pin: true,
                scrub: 0.6,
                invalidateOnRefresh: true, // recalcula el FLIP al cambiar el tamaño de la ventana
                onRefresh: syncSelection,
              },
            });

            tl.to(selection, { opacity: 1, duration: 0.02 }, 0)
              .to(frame, { drawSVG: "100%", duration: 0.08 }, 0)
              .to(handles, { scale: 1, duration: 0.03, stagger: 0.01 }, 0.03)
              // Guías de centro: aparecen mientras la muñeca "se mueve", como en Figma.
              .to(guides, { autoAlpha: 1, duration: 0.03 }, 0.1)
              .fromTo(center, { rotation: -90, scale: 0.4 }, { rotation: 0, scale: 1, duration: 0.06 }, 0.1)
              .fromTo(
                avatar,
                { x: flipX, y: flipY, scale: scene.scale, transformOrigin: "50% 50%" },
                { x: 0, y: 0, scale: 1, duration: 0.33, ease: "power2.inOut" },
                0.12,
              )
              // Deseleccionar justo al empezar a escribir: instantáneo, como un clic fuera en Figma
              // (caja, medidas y guías desaparecen juntas).
              .set(selection, { opacity: 0 }, 0.45)
              .to(caret, { opacity: 1, duration: 0.01 }, 0.45)
              .to(typed, { greeting: greetingChars.length, duration: 0.15, onUpdate: renderTyping }, 0.45)
              .to(typed, { role: roleChars.length, duration: 0.15, onUpdate: renderTyping }, 0.6)
              .to(roleChars, { color: primary, duration: 0.04, stagger: 0.1 / roleChars.length }, 0.76)
              .fromTo(role, { "--role-stroke": "2px" }, { "--role-stroke": "0px", duration: 0.04 }, 0.88)
              .to(subtitle, { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.86)
              .to(caret, { opacity: 0, duration: 0.03 }, 0.9)
              .set({}, {}, 1); // la línea de tiempo dura exactamente 1

            syncSelection();
            return tl;
          },
        });

        // Escena 1 lista: el CSS deja de ocultar el contenido.
        hero.classList.add("is-ready");
        ScrollTrigger.refresh();

        return () => split.revert();
      });

      // Sin animaciones (reduced-motion): la escena 2 tal cual.
      mm.add(`not all and ${MEDIA.motion}`, () => hero.classList.add("is-ready"));

      return () => mm.revert();
    },
    { scope },
  );
}

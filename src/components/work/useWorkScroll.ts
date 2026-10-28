import type { RefObject } from "react";

import { gsap, useGSAP, ScrollTrigger, MEDIA } from "@/lib/gsap";
import { WORK_PROJECTS } from "@/config/site";

// "Selected work" con scroll: la sección se queda fija (pin) y el scroll recorre los proyectos
// dentro del marco. Por cada cambio de proyecto:
//   - la imagen actual sube y sale; la siguiente entra desde abajo (como hacer scroll en la pantalla);
//   - el marco se transforma a la forma del proyecto: teléfono, o web con la proporción de su vídeo;
//   - el nombre del proyecto pasa a negro en la lista y se queda así (acumulado);
//   - la descripción bajo el marco cambia a la del proyecto actual.
const STEP = 1; // duración de cada cambio de proyecto en la línea de tiempo
const HOLD = 0.35; // pausa al principio y al final para ver el primer y el último proyecto
const SCROLL_PER_PROJECT = { wide: 0.9, narrow: 0.75 }; // pantallas de scroll por cada cambio

export function useWorkScroll(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;
      const $ = <T extends Element>(selector: string) => section.querySelector<T>(selector)!;
      const frame = $<HTMLElement>(".work__screen > .work__frame");
      const media = gsap.utils.toArray<HTMLVideoElement>(".work__media", frame);
      const items = gsap.utils.toArray<HTMLElement>(".work__item", section);
      const descriptions = gsap.utils.toArray<HTMLElement>(".work__description", section);
      const probe = (type: string) => $<HTMLElement>(`[data-probe="${type}"]`);

      // Tamaño y radio del marco para cada proyecto, medidos en los marcos fantasma (se recalculan al
      // redimensionar). Teléfono: tal cual. Web: el ancho del fantasma y el alto según la proporción
      // del vídeo, para que se vea entero sin recortes ni bandas.
      const shape = (index: number) => {
        const el = probe(WORK_PROJECTS[index].frame);
        const box = el.getBoundingClientRect();
        const height = WORK_PROJECTS[index].frame === "web" ? box.width / Number(media[index].dataset.ratio) : box.height;
        return { width: box.width, height, borderRadius: getComputedStyle(el).borderTopLeftRadius };
      };

      // Solo se reproduce el vídeo del proyecto actual, y solo si hay animaciones y la sección está en pantalla.
      let autoplay = false;
      let inView = false;
      const syncVideos = () => {
        media.forEach((video, i) => {
          if (autoplay && inView && i === shown) video.play().catch(() => {}); // el navegador puede bloquearlo
          else video.pause();
        });
      };

      // Marca en la lista los proyectos destapados (acumulado), cuál es el actual y su descripción.
      let shown = -1;
      const setCurrent = (index: number) => {
        if (index === shown) return;
        shown = index;
        items.forEach((item, i) => {
          item.classList.toggle("is-revealed", i <= index);
          item.classList.toggle("is-current", i === index);
        });
        descriptions.forEach((description, i) => description.classList.toggle("is-current", i === index));
        // El marco enlaza al proyecto actual (mismo destino que su enlace en la lista).
        frame.setAttribute("href", items[index].querySelector("a")!.getAttribute("href")!);
        media[index].currentTime = 0; // cada proyecto empieza su vídeo desde el principio
        syncVideos();
      };

      const mm = gsap.matchMedia();

      mm.add({ wide: MEDIA.wide, narrow: MEDIA.narrow }, (context) => {
        const screens = context.conditions?.wide ? SCROLL_PER_PROJECT.wide : SCROLL_PER_PROJECT.narrow;
        const transitions = WORK_PROJECTS.length - 1;

        section.classList.add("is-animated");
        gsap.set(media, { yPercent: (i) => (i === 0 ? 0 : 100) });
        gsap.set(frame, shape(0));

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          // En cada fotograma de la animación (no del scroll: con el suavizado "scrub" la animación
          // sigue avanzando un instante después de parar), así la lista coincide siempre con el marco.
          // Proyecto actual = cambios cuya mitad ya pasó.
          onUpdate: () => {
            const time = tl.time() - HOLD;
            setCurrent(gsap.utils.clamp(0, transitions, Math.floor(time / STEP + 0.5)));
          },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * screens * transitions}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true, // vuelve a medir los marcos fantasma al cambiar el tamaño
          },
        });

        WORK_PROJECTS.slice(1).forEach((_, i) => {
          const at = HOLD + i * STEP;
          tl.to(media[i], { yPercent: -100, duration: STEP * 0.8 }, at).fromTo(
            media[i + 1],
            { yPercent: 100 },
            { yPercent: 0, duration: STEP * 0.8 },
            at,
          );
          tl.to(
            frame,
            {
              width: () => shape(i + 1).width,
              height: () => shape(i + 1).height,
              borderRadius: () => shape(i + 1).borderRadius,
              duration: STEP * 0.8,
            },
            at,
          );
        });
        tl.set({}, {}, HOLD * 2 + transitions * STEP); // pausa final antes de soltar la sección

        // Teclado / lector de pantalla: al enfocar un proyecto de la lista, el scroll salta
        // hasta él para que el marco muestre ese proyecto (solo con foco de teclado, no al hacer clic).
        const onFocus = (event: FocusEvent) => {
          const target = event.target as Element;
          const index = items.findIndex((item) => item.contains(target));
          const st = tl.scrollTrigger;
          if (index < 0 || !st || !target.matches(":focus-visible")) return;
          const time = index === 0 ? 0 : HOLD + (index - 1) * STEP + STEP * 0.8;
          window.scrollTo({ top: st.start + ((st.end - st.start) * time) / tl.duration() });
        };
        section.addEventListener("focusin", onFocus);

        // Vídeos: en pausa fuera de pantalla (ahorra batería y datos).
        autoplay = true;
        const visibility = new IntersectionObserver((entries) => {
          inView = entries[entries.length - 1].isIntersecting; // el aviso más reciente
          syncVideos();
        });
        visibility.observe(section);

        setCurrent(0);
        ScrollTrigger.refresh();

        return () => {
          section.removeEventListener("focusin", onFocus);
          visibility.disconnect();
          autoplay = false;
          syncVideos();
          section.classList.remove("is-animated");
          gsap.set(frame, { clearProps: "width,height,borderRadius" });
          setCurrent(0);
        };
      });

      // Sin animaciones: los vídeos no se reproducen (se ve la portada del primero)
      // y todos los proyectos visibles en la lista (en negro).
      mm.add(`not all and ${MEDIA.motion}`, () => {
        section.classList.add("is-static");
        return () => section.classList.remove("is-static");
      });

      return () => mm.revert();
    },
    { scope },
  );
}

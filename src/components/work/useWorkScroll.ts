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
const HOLD = 0.35; // pausa al principio para ver el primer proyecto
// Al final casi no hay pausa: en cuanto el último proyecto termina de entrar, la página sigue bajando
// (con una pausa larga la sección parecía quedarse bloqueada después del último proyecto).
const END_HOLD = 0.05;
const SCROLL_PER_STEP = { wide: 0.65, narrow: 0.55 }; // pantallas de scroll por cada unidad de la línea de tiempo

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

      const viewport = $<HTMLElement>(".work__viewport");

      // Tamaño y radio del marco para cada proyecto, medidos en los marcos fantasma (se recalculan al
      // redimensionar). Teléfono: tal cual. Web: el ancho del fantasma y el alto según la proporción
      // del vídeo. El bisel de cristal (grosor = distancia de la pantalla interior al borde) se suma
      // fuera, así la pantalla interior conserva la proporción exacta del vídeo: sin recortes ni bandas.
      // El radio (en px) se escribe en la variable --frame-radius; el de la pantalla interior sale de él.
      const shape = (index: number) => {
        const el = probe(WORK_PROJECTS[index].frame);
        const box = el.getBoundingClientRect();
        const bezel = viewport.offsetTop;
        const height =
          WORK_PROJECTS[index].frame === "web" ? (box.width - 2 * bezel) / Number(media[index].dataset.ratio) + 2 * bezel : box.height;
        return { width: box.width, height, radius: parseFloat(getComputedStyle(el).borderTopLeftRadius) };
      };
      // El radio se anima como un número normal y se copia a la variable CSS en cada fotograma.
      // (Animar la variable directamente falla: en el CSS es una fórmula, GSAP la lee como 0 y al
      // volver atrás con el scroll dejaba el teléfono sin esquinas.)
      const corner = { radius: 0 };
      const applyCorner = () => frame.style.setProperty("--frame-radius", `${corner.radius}px`);

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
        const screens = context.conditions?.wide ? SCROLL_PER_STEP.wide : SCROLL_PER_STEP.narrow;
        const transitions = WORK_PROJECTS.length - 1;
        const total = HOLD + (transitions - 1) * STEP + STEP * 0.8 + END_HOLD; // el último cambio dura STEP * 0.8

        section.classList.add("is-animated");
        gsap.set(media, { yPercent: (i) => (i === 0 ? 0 : 100) });
        const first = shape(0);
        gsap.set(frame, { width: first.width, height: first.height });
        corner.radius = first.radius;
        applyCorner();

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
            end: () => `+=${window.innerHeight * screens * total}`,
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
            { width: () => shape(i + 1).width, height: () => shape(i + 1).height, duration: STEP * 0.8 },
            at,
          ).to(corner, { radius: () => shape(i + 1).radius, duration: STEP * 0.8, onUpdate: applyCorner }, at);
        });
        tl.set({}, {}, total); // pequeña pausa final antes de soltar la sección

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
          gsap.set(frame, { clearProps: "width,height" });
          frame.style.removeProperty("--frame-radius");
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

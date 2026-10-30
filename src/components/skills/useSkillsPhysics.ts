import type { RefObject } from "react";
import type MatterJS from "matter-js";

import { gsap, useGSAP, ScrollTrigger, MEDIA } from "@/lib/gsap";

// Píldoras de habilidades con gravedad (Matter.js): al llegar a la sección caen una tras otra,
// rebotan un poco, chocan entre ellas y se amontonan. Con ratón se pueden agarrar y lanzar.
//   - Matter.js se descarga solo cuando la sección se acerca (no pesa en la carga inicial).
//   - El motor se detiene cuando todo está quieto o la sección no se ve (ahorra batería).
//   - En táctil no se arrastran: el dedo sigue haciendo scroll en la página.
//   - Sin animaciones (reduced-motion): no hay física; se ve la lista ordenada (CSS).
const WALL = 400; // grosor de suelo y paredes invisibles
const FLOOR_GAP = 2; // el suelo, 2 px por encima del borde: el contorno de la píldora de abajo no se corta
const PHYSICS = {
  pill: { restitution: 0.2, friction: 0.5, frictionAir: 0.02 }, // poco rebote, se asientan con calma
  dot: { restitution: 0.35, friction: 0.3, frictionAir: 0.01 },
};

type Matter = typeof MatterJS;
type Piece = { el: HTMLElement; body: MatterJS.Body; w: number; h: number };

export function useSkillsPhysics(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const arena = root.querySelector<HTMLElement>(".skills__arena")!;
      const mm = gsap.matchMedia();

      mm.add(MEDIA.motion, () => {
        let stop = () => {};
        let cancelled = false;
        const loadMatter = () => import("matter-js").then((module) => module.default);

        root.classList.add("is-waiting"); // píldoras ocultas hasta que empiecen a caer

        // Se descarga un poco antes de llegar, y la caída empieza al entrar la sección.
        const prefetch = ScrollTrigger.create({ trigger: arena, start: "top bottom+=400", once: true, onEnter: loadMatter });
        const drop = ScrollTrigger.create({
          trigger: arena,
          start: "top 75%",
          once: true,
          onEnter: () =>
            loadMatter().then((Matter) => {
              if (!cancelled) stop = start(Matter, root, arena);
            }),
        });
        gsap.from(root.querySelector(".skills__word"), {
          autoAlpha: 0,
          y: 40,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        });

        return () => {
          cancelled = true;
          prefetch.kill();
          drop.kill();
          stop();
          root.classList.remove("is-waiting", "is-physics");
        };
      });

      return () => mm.revert();
    },
    { scope },
  );
}

function start(Matter: Matter, root: HTMLElement, arena: HTMLElement) {
  const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;
  const engine = Engine.create({ enableSleeping: true });

  // Modo física: las piezas pasan a posición absoluta (CSS) y se miden.
  root.classList.add("is-physics");
  root.classList.remove("is-waiting");
  let width = arena.clientWidth;
  const height = arena.clientHeight;

  const elements = gsap.utils.toArray<HTMLElement>(".skills__pill, .skills__dot", arena);
  const pieces: Piece[] = gsap.utils.shuffle(elements).map((el, i) => {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const x = gsap.utils.random(Math.min(w / 2, width / 2), Math.max(width - w / 2, width / 2));
    const y = -h - i * 50 - gsap.utils.random(0, 40); // escalonadas: caen una tras otra
    const body = el.classList.contains("skills__dot")
      ? Bodies.circle(x, y, w / 2, PHYSICS.dot)
      : Bodies.rectangle(x, y, w, h, { ...PHYSICS.pill, chamfer: { radius: h / 2 }, angle: gsap.utils.random(-0.35, 0.35) });
    return { el, body, w, h };
  });

  // Suelo y paredes invisibles (las paredes suben mucho para cubrir la caída).
  const floor = Bodies.rectangle(width / 2, height - FLOOR_GAP + WALL / 2, width * 4, WALL, { isStatic: true });
  const left = Bodies.rectangle(-WALL / 2, 0, WALL, height * 6, { isStatic: true });
  const right = Bodies.rectangle(width + WALL / 2, 0, WALL, height * 6, { isStatic: true });
  Composite.add(engine.world, [floor, left, right, ...pieces.map(({ body }) => body)]);

  // Cada fotograma: se avanza la física y se mueve cada píldora a la posición de su cuerpo.
  const render = () => {
    for (const { el, body, w, h } of pieces) {
      el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;
    }
  };
  let dragging = false;
  let running = false;
  let visible = true;
  const tick = (_time: number, deltaMs: number) => {
    Engine.update(engine, Math.min(deltaMs, 32)); // tope por si la pestaña estuvo en segundo plano
    render();
    if (!dragging && pieces.every(({ body }) => body.isSleeping)) setRunning(false); // todo quieto
  };
  const setRunning = (on: boolean) => {
    if (on === running) return;
    running = on;
    if (on) gsap.ticker.add(tick);
    else gsap.ticker.remove(tick);
  };
  const wake = () => visible && setRunning(true);

  render();
  setRunning(true);

  // Pausa fuera de pantalla.
  const visibility = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) wake();
    else setRunning(false);
  });
  visibility.observe(arena);

  // Arrastrar con el ratón (no en táctil: el dedo sigue haciendo scroll).
  let releaseMouse = () => {};
  if (window.matchMedia(MEDIA.pointer).matches) {
    const mouse = Mouse.create(arena);
    // Funciones internas con las que Matter escucha el ratón (existen, pero sus tipos no las declaran).
    const handlers = mouse as unknown as Record<"mousewheel" | "mousedown" | "mousemove" | "mouseup", EventListener>;
    // Matter bloquea la rueda y el dedo sobre la zona: se lo quitamos para que la página haga scroll.
    arena.removeEventListener("wheel", handlers.mousewheel);
    arena.removeEventListener("touchstart", handlers.mousedown);
    arena.removeEventListener("touchmove", handlers.mousemove);
    arena.removeEventListener("touchend", handlers.mouseup);
    const grab = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
    Composite.add(engine.world, grab);
    Events.on(grab, "startdrag", () => {
      dragging = true;
      arena.classList.add("is-dragging");
    });
    Events.on(grab, "enddrag", () => {
      dragging = false;
      arena.classList.remove("is-dragging");
    });
    // Al pulsar, el motor se despierta; al soltar fuera de la zona, la píldora se suelta igualmente.
    const release = handlers.mouseup;
    arena.addEventListener("mousedown", wake);
    window.addEventListener("mouseup", release);
    releaseMouse = () => {
      arena.removeEventListener("mousedown", wake);
      window.removeEventListener("mouseup", release);
    };
  }

  // Si cambia el ancho, se mueven las paredes y las píldoras se recolocan solas.
  const resize = new ResizeObserver(() => {
    if (arena.clientWidth === width) return;
    width = arena.clientWidth;
    Body.setPosition(floor, { x: width / 2, y: height - FLOOR_GAP + WALL / 2 });
    Body.setPosition(right, { x: width + WALL / 2, y: 0 });
    for (const { body, w } of pieces) {
      if (body.position.x > width - w / 2) Body.setPosition(body, { x: width - w / 2, y: body.position.y - 60 });
    }
    pieces.forEach(({ body }) => Matter.Sleeping.set(body, false));
    wake();
  });
  resize.observe(arena);

  return () => {
    setRunning(false);
    visibility.disconnect();
    resize.disconnect();
    releaseMouse();
    Engine.clear(engine);
    pieces.forEach(({ el }) => (el.style.transform = ""));
  };
}

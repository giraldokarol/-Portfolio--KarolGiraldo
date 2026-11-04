import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Trans, useTranslation } from "react-i18next";

import MeshOrb from "./MeshOrb";
import { useCaseDecisionsReveal } from "./useCaseDecisionsReveal";

// Imagen de cada decisión: public/images/case/<slug>/<image>.png (composición con fondo transparente).
export type DecisionImage = { image: string; width: number; height: number };

type DecisionText = {
  title: string;
  items?: { title: string; text: string }[];
  text?: string;
  alt: string;
};

type Props = {
  // Clave de los textos en locales/*/common.json (p. ej. "cases.interfaceWebApp.decisions").
  textKey: string;
  slug: string;
  // Una por tarjeta, en el mismo orden que <textKey>.slides.
  images: readonly DecisionImage[];
};

// Arrastre mínimo (px) para pasar de tarjeta con el dedo o el ratón.
const SWIPE = 50;

// Bolitas de color (MeshOrb) detrás de las tarjetas: grande a la izquierda tras el título, otra a la derecha.
// Centro (x, y) en % de la sección y diámetro en vw. Móvil: grande arriba, pequeña abajo a la derecha.
const ORBS = [
  { x: 20, y: 38, size: 28, mobile: { x: 20, y: 18, size: 60 } },
  { x: 93, y: 34, size: 20, mobile: { x: 92, y: 70, size: 34 } },
];

// "Key Decisions" de un caso de estudio: mini carrusel de tarjetas (texto a la izquierda, imagen a la
// derecha). Se pasa con las flechas, arrastrando (dedo o ratón) o haciendo clic en la tarjeta que asoma.
// La tarjeta siguiente/anterior asoma por el borde. Estilos: styles/sections/_case-decisions.scss
export default function CaseDecisions({ textKey, slug, images }: Props) {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const slides = t(`${textKey}.slides`, { returnObjects: true }) as DecisionText[];
  const [current, setCurrent] = useState(0);
  const last = slides.length - 1;

  // Arrastre: dónde empezó y si hubo arrastre (para no tratarlo como clic al soltar).
  const drag = useRef<{ x: number; moved: boolean } | null>(null);

  // Flechas: al llegar a un extremo, la flecha pulsada se desactiva; el foco pasa a la otra para no perderse.
  // Se mueve después de actualizar la pantalla (antes, la otra flecha aún está desactivada y no lo acepta).
  const previous = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const moveFocusTo = useRef<HTMLButtonElement | null>(null);

  const go = (index: number) => {
    const target = Math.max(0, Math.min(last, index));
    if (target === 0 && document.activeElement === previous.current) moveFocusTo.current = next.current;
    if (target === last && document.activeElement === next.current) moveFocusTo.current = previous.current;
    setCurrent(target);
  };

  useEffect(() => {
    moveFocusTo.current?.focus();
    moveFocusTo.current = null;
  }, [current]);

  const onPointerDown = (event: PointerEvent) => {
    drag.current = { x: event.clientX, moved: false };
  };
  const onPointerUp = (event: PointerEvent) => {
    const start = drag.current;
    if (!start) return;
    const distance = event.clientX - start.x;
    if (Math.abs(distance) > SWIPE) {
      start.moved = true;
      go(current + (distance < 0 ? 1 : -1));
    }
  };

  useCaseDecisionsReveal(root);

  return (
    <section
      className="case-decisions"
      ref={root}
      aria-labelledby="case-decisions-title"
      aria-roledescription="carousel"
    >
      {ORBS.map(({ mobile, ...desktop }) => (
        <MeshOrb key={`${desktop.x}-${desktop.y}`} className="case-decisions__orb" {...desktop} mobile={mobile} />
      ))}

      <div className="case-decisions__inner container">
        <div className="case-decisions__head">
          <div>
            <span className="case-decisions__label" aria-hidden="true">
              {t(`${textKey}.label`)}
            </span>
            <h2 id="case-decisions-title" className="case-decisions__title">
              {t(`${textKey}.title`)}
            </h2>
          </div>

          <div className="case-decisions__controls">
            <button
              ref={previous}
              type="button"
              className="case-decisions__arrow"
              onClick={() => go(current - 1)}
              disabled={current === 0}
              aria-label={t(`${textKey}.previous`)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 12H3m6-6-6 6 6 6" />
              </svg>
            </button>
            <button
              ref={next}
              type="button"
              className="case-decisions__arrow"
              onClick={() => go(current + 1)}
              disabled={current === last}
              aria-label={t(`${textKey}.next`)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 12h18m-6-6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* touch-action: el dedo sigue haciendo scroll vertical; el horizontal lo usa el carrusel. */}
        <div
          className="case-decisions__viewport"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
        >
          <div className="case-decisions__track" style={{ "--current": current } as CSSProperties}>
            {slides.map((slide, index) => (
              <article
                key={images[index].image}
                className={`case-decisions__slide ${index === current ? "is-current" : ""}`}
                aria-roledescription="slide"
                aria-label={t(`${textKey}.slideLabel`, { current: index + 1, total: slides.length })}
                aria-hidden={index !== current}
                // La tarjeta que asoma lleva a ella (salvo si se estaba arrastrando).
                onClick={() => {
                  if (index !== current && !drag.current?.moved) go(index);
                }}
              >
                <div className="case-decisions__text">
                  <h3 className="case-decisions__slide-title">
                    {/* <br/> = saltos de línea del diseño (solo en escritorio). */}
                    <Trans i18nKey={`${textKey}.slides.${index}.title`} />
                  </h3>
                  {slide.items && (
                    <ul className="case-decisions__items">
                      {slide.items.map((item) => (
                        <li key={item.title}>
                          <span className="case-decisions__item-title">{item.title}</span>
                          <span className="case-decisions__item-text">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {slide.text && <p className="case-decisions__slide-text">{slide.text}</p>}
                </div>

                <img
                  className="case-decisions__image"
                  src={`/images/case/${slug}/${images[index].image}.png`}
                  alt={slide.alt}
                  width={images[index].width}
                  height={images[index].height}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </article>
            ))}
          </div>
        </div>

        {/* Aviso para lectores de pantalla al cambiar de tarjeta. */}
        <p className="case-decisions__status" aria-live="polite">
          {t(`${textKey}.slideLabel`, { current: current + 1, total: slides.length })}
        </p>
      </div>
    </section>
  );
}

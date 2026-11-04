import { useRef, useState, type CSSProperties } from "react";
import { Trans, useTranslation } from "react-i18next";

import MeshOrb from "./MeshOrb";
import { useCaseResearchReveal } from "./useCaseResearchReveal";
import { useCaseResearchScroll } from "./useCaseResearchScroll";

// Posición de una pieza dentro de su composición, en % de la caja: x e y = esquina de arriba a la
// izquierda, w = ancho (el alto sale de la proporción de la imagen o de la tarjeta).
export type Placement = { x: number; y: number; w: number };

// Captura de una composición: public/images/case/<slug>/<name>.png (ya trae su sombra y su margen).
export type GapImage = {
  name: string;
  width: number;
  height: number;
  desktop: Placement;
  mobile: Placement;
};

// Tarjeta del selector de rol, dibujada en HTML (se traduce): seleccionada, normal o difuminada.
export type RoleCard = {
  id: string; // clave en <textKey>.roles
  icon: keyof typeof ROLE_ICONS;
  state: "selected" | "default" | "faded" | "ghost";
  desktop: Placement;
  mobile: Placement;
};

// Caja de la composición. Escritorio: x y w en % de la columna derecha (puede salir un poco por la
// derecha); ratio = ancho / alto. Móvil: todo el ancho, con su propia proporción.
// y (opcional): desplazamiento vertical en % del ancho de la caja; negativo = sube detrás de la frase
// (para las imágenes que traen mucho margen transparente arriba).
export type ResearchGap = {
  stage: { x: number; w: number; ratio: number; mobileRatio: number; y?: number };
  // Las piezas se pintan en este orden: la última queda encima.
  images?: GapImage[];
  roles?: RoleCard[];
};

type GapText = { number: string; text: string; alt: string };
type RoleText = { title: string; text: string };

type Props = {
  // Clave de los textos en locales/*/common.json (p. ej. "cases.interfaceWebApp.research").
  textKey: string;
  slug: string;
  // Composición de cada hueco, en el mismo orden que <textKey>.gaps.
  gaps: readonly ResearchGap[];
};

// Bolitas de color (MeshOrb) que llenan el blanco mientras la sección está fija (solo escritorio).
// Reparto en diagonal por los huecos libres: centro (x, y) en % de la pantalla y diámetro en vw.
const ORBS = [
  { x: 17, y: 19, size: 10 }, // mediana, arriba a la izquierda
  { x: 81, y: 68, size: 22 }, // grande, abajo a la derecha
  { x: 47, y: 76, size: 5.5 }, // pequeña, abajo en el centro
] as const;

// Iconos de línea de las tarjetas de rol (24 × 24, color del texto).
const ROLE_ICONS = {
  badge: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M10 2h4v3h-4z" />
      <circle cx="12" cy="11" r="2.5" />
      <path d="M8 18c.6-2 2.2-3 4-3s3.4 1 4 3" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 4 7v10l8 4 8-4V7z" />
      <path d="m4 7 8 4 8-4M12 11v10M8 5l8 4" />
    </>
  ),
  advisor: (
    <>
      <circle cx="10" cy="8" r="4" />
      <path d="M3 21c0-3.9 3.1-7 7-7 1 0 2 .2 2.8.6" />
      <circle cx="18" cy="18" r="2" />
      <path d="M18 14.5v1.5M18 20v1.5M14.5 18H16M20 18h1.5M15.5 15.5l1 1M19.5 19.5l1 1M15.5 20.5l1-1M19.5 16.5l1-1" />
    </>
  ),
  money: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2-1.4 0-2.5-.5-3-1.5M12 6v1.5M12 16.5V18" />
    </>
  ),
} as const;

// Variables CSS con la posición de una pieza: escritorio (--x, --y, --w) y móvil (--x-sm…).
function place({ desktop, mobile }: { desktop: Placement; mobile: Placement }) {
  return {
    "--x": `${desktop.x}%`,
    "--y": `${desktop.y}%`,
    "--w": `${desktop.w}%`,
    "--x-sm": `${mobile.x}%`,
    "--y-sm": `${mobile.y}%`,
    "--w-sm": `${mobile.w}%`,
  } as CSSProperties;
}

// "Research" de un caso de estudio: a la izquierda el texto; a la derecha los huecos encontrados en la
// investigación, cada uno con su número gigante, su frase y una composición de pantallas del producto.
// Móvil y tablet: los huecos son un carrusel que se desliza con el dedo (scroll horizontal con imán),
// con puntos debajo para saber en cuál se está y saltar a otro.
// Animaciones en case/useCaseResearchReveal.ts (entrada) y case/useCaseResearchScroll.ts (scroll). Estilos: styles/sections/_case-research.scss
export default function CaseResearch({ textKey, slug, gaps }: Props) {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const texts = t(`${textKey}.gaps`, { returnObjects: true }) as GapText[];
  const roles = t(`${textKey}.roles`, { returnObjects: true }) as Record<string, RoleText>;

  // Carrusel de móvil: hueco que se ve (según el scroll horizontal de la lista) y salto con los puntos.
  const list = useRef<HTMLOListElement>(null);
  const [current, setCurrent] = useState(0);
  const items = () => [...(list.current?.children ?? [])] as HTMLElement[];
  const onScroll = () => {
    const box = list.current;
    if (!box) return;
    const distances = items().map((item) => Math.abs(item.offsetLeft - box.offsetLeft - box.scrollLeft));
    setCurrent(distances.indexOf(Math.min(...distances)));
  };
  const goTo = (index: number) => {
    const box = list.current;
    const item = items()[index];
    if (!box || !item) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ left: item.offsetLeft - box.offsetLeft, behavior: still ? "auto" : "smooth" });
  };

  useCaseResearchReveal(root);
  useCaseResearchScroll(root);

  return (
    <section className="case-research" ref={root} aria-labelledby="case-research-title">
      <div className="case-research__inner container">
        <div className="case-research__mesh" aria-hidden="true">
          {ORBS.map((orb) => (
            <MeshOrb key={`${orb.x}-${orb.y}`} {...orb} />
          ))}
        </div>

        <div className="case-research__intro">
          <span className="case-research__label" aria-hidden="true">
            {t(`${textKey}.label`)}
          </span>
          <h2 id="case-research-title" className="case-research__title">
            {t(`${textKey}.title`)}
          </h2>
          <p className="case-research__lead">{t(`${textKey}.lead`)}</p>
          <p className="case-research__text">{t(`${textKey}.text`)}</p>
          <p className="case-research__conclusion">{t(`${textKey}.conclusion`)}</p>
        </div>

        <ol
          ref={list}
          className="case-research__gaps"
          aria-label={t(`${textKey}.gapsLabel`)}
          onScroll={onScroll}
        >
          {gaps.map((gap, index) => {
            const text = texts[index];
            const stageStyle = {
              "--stage-x": `${gap.stage.x}%`,
              "--stage-w": `${gap.stage.w}%`,
              "--ratio": gap.stage.ratio,
              "--ratio-sm": gap.stage.mobileRatio,
              "--stage-y": (gap.stage.y ?? 0) / 100,
            } as CSSProperties;

            return (
              <li key={text.number} className="case-research__gap">
                <span className="case-research__gap-number" aria-hidden="true">
                  {text.number}
                </span>
                <p className="case-research__gap-text">
                  {/* <strong> = nombre del hueco, en negrita. */}
                  <Trans i18nKey={`${textKey}.gaps.${index}.text`} components={{ strong: <strong /> }} />
                </p>

                {/* Una sola imagen para los lectores de pantalla: la composición entera, con su descripción. */}
                <div className="case-research__stage" style={stageStyle} role="img" aria-label={text.alt}>
                  {gap.images?.map((image) => (
                    <img
                      key={image.name}
                      className="case-research__piece"
                      style={place(image)}
                      src={`/images/case/${slug}/${image.name}.png`}
                      alt=""
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ))}

                  {gap.roles?.map((role) => (
                    <div
                      key={role.id}
                      className={`case-research__piece case-research__role case-research__role--${role.state}`}
                      style={place(role)}
                    >
                      <span className="case-research__role-radio" />
                      <svg className="case-research__role-icon" viewBox="0 0 24 24" aria-hidden="true">
                        {ROLE_ICONS[role.icon]}
                      </svg>
                      <span className="case-research__role-title">{roles[role.id].title}</span>
                      <span className="case-research__role-text">{roles[role.id].text}</span>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Puntos del carrusel (solo móvil y tablet): el actual, más largo. */}
        <div className="case-research__dots">
          {gaps.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`case-research__dot ${index === current ? "is-current" : ""}`}
              onClick={() => goTo(index)}
              aria-label={t(`${textKey}.gapLabel`, { current: index + 1, total: gaps.length })}
              aria-current={index === current ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

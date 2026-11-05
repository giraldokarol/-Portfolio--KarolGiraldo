import { useRef, type ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";

import MeshGradient, { type MeshCircle } from "../MeshGradient";
import MeshOrb, { type OrbPlacement } from "./MeshOrb";
import { useCaseIntroReveal } from "./useCaseIntroReveal";
import { useFitWord } from "./useFitWord";

// detail: párrafo opcional en gris bajo la entradilla.
type Block = { number: string; title: string; lead: string; detail?: string };
type Card = { title: string; text: string; alt: string };

type Props = {
  // Clave de los textos en locales/*/common.json (p. ej. "cases.interfaceWebApp.intro").
  textKey: string;
  // Imágenes de las tarjetas, en el mismo orden que los textos: public/images/case/<slug>/<nombre>.png
  slug: string;
  images: readonly string[];
  // Tamaño real de las imágenes (el navegador reserva su hueco antes de cargarlas).
  imageSize?: { width: number; height: number };
  // Capturas web (en su ventana de navegador) o teléfonos, que salen por debajo de las tarjetas.
  device?: "web" | "phone";
  // Visuales hechos en código en lugar de imágenes (uno por tarjeta, mismo orden). Se leen como una sola
  // imagen con el texto alternativo de la tarjeta (<textKey>.cards.N.alt).
  visuals?: readonly ReactNode[];
  // Bolitas de color (MeshOrb) en lugar del círculo de abajo a la izquierda: centro en % del bloque de
  // las tarjetas y diámetro en vw.
  orbs?: (OrbPlacement & { mobile?: OrbPlacement })[];
};

// Un solo círculo que llena su caja (posición y radio en fracción de la caja).
const ORB: MeshCircle[] = [{ x: 0.5, y: 0.5, r: 0.5 }];

// Tamaño de las capturas web (760 × 510).
const WEB_IMAGE_SIZE = { width: 760, height: 510 };

// "The problem" / "The solution" de un caso de estudio + tarjetas con las pantallas clave (capturas web
// o teléfonos).
// Animación en case/useCaseIntroReveal.ts. Estilos: styles/sections/_case-intro.scss
export default function CaseIntro({
  textKey,
  slug,
  images,
  imageSize = WEB_IMAGE_SIZE,
  device = "web",
  orbs,
  visuals,
}: Props) {
  const { t, i18n } = useTranslation();
  // Nota opcional bajo la entradilla de "solution" (p. ej. confidencialidad, marcada con * en esa entradilla).
  const note = i18n.exists(`${textKey}.note`) ? t(`${textKey}.note`) : null;
  const root = useRef<HTMLElement>(null);
  const problem = t(`${textKey}.problem`, { returnObjects: true }) as Block;
  const solution = t(`${textKey}.solution`, { returnObjects: true }) as Block;
  const cards = t(`${textKey}.cards`, { returnObjects: true }) as Card[];

  useFitWord(root, ".case-intro__bg-word");
  useCaseIntroReveal(root);

  return (
    <section className={`case-intro case-intro--${device}`} ref={root} aria-labelledby="case-problem-title">

      <div className="case-intro__inner container">
        <div className="case-intro__blocks">
          {[
            { id: "problem", block: problem },
            { id: "solution", block: solution },
          ].map(({ id, block }) => (
            <div key={id} className={`case-intro__block case-intro__block--${id}`}>
              <span className="case-intro__number" aria-hidden="true">
                {block.number}
              </span>
              <h2 id={`case-${id}-title`} className="case-intro__title">
                {block.title}
              </h2>
              <p className="case-intro__lead">{block.lead}</p>
              {block.detail && <p className="case-intro__detail">{block.detail}</p>}
              {id === "solution" && note && <p className="case-intro__note">{note}</p>}
            </div>
          ))}
        </div>

        <div className="case-intro__showcase">
          <span className="case-intro__bg-word" aria-hidden="true">
            {t(`${textKey}.backgroundWord`)}
          </span>
          {orbs ? (
            orbs.map(({ mobile, ...desktop }) => (
              <MeshOrb key={`${desktop.x}-${desktop.y}`} className="case-intro__mesh-orb" {...desktop} mobile={mobile} />
            ))
          ) : (
            <div className="case-intro__orb" aria-hidden="true">
              <MeshGradient circles={ORB} />
            </div>
          )}

          <ul className="case-intro__cards">
            {cards.map((card, index) => (
              <li key={images[index]} className="case-intro__item">
                {/* La entrada mueve el <li>; el hover, la tarjeta: cada animación en su propio elemento. */}
                <div className="case-intro__card">
                  <h3 className="case-intro__card-title">{card.title}</h3>
                  <p className="case-intro__card-text">
                    {/* <strong> = palabras en negrita del diseño. */}
                    <Trans i18nKey={`${textKey}.cards.${index}.text`} components={{ strong: <strong /> }} />
                  </p>
                  {visuals ? (
                    <div className="case-intro__card-visual" role="img" aria-label={card.alt}>
                      {visuals[index]}
                    </div>
                  ) : (
                    <img
                      className="case-intro__card-image"
                      src={`/images/case/${slug}/${images[index]}.png`}
                      alt={card.alt}
                      {...imageSize}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
}

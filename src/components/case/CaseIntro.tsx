import { useRef } from "react";
import { useTranslation } from "react-i18next";

import MeshGradient, { type MeshCircle } from "../MeshGradient";
import { useCaseIntroReveal } from "./useCaseIntroReveal";
import { useFitWord } from "./useFitWord";

type Block = { number: string; title: string; lead: string };
type Card = { title: string; text: string; alt: string };

type Props = {
  // Clave de los textos en locales/*/common.json (p. ej. "cases.interfaceWebApp.intro").
  textKey: string;
  // Imágenes de las tarjetas, en el mismo orden que los textos: public/images/case/<slug>/<nombre>.png
  slug: string;
  images: readonly string[];
};

// Un solo círculo que llena su caja (posición y radio en fracción de la caja).
const ORB: MeshCircle[] = [{ x: 0.5, y: 0.5, r: 0.5 }];

// Tamaño real de las capturas (760 × 510): el navegador reserva su hueco antes de cargarlas.
const IMAGE_SIZE = { width: 760, height: 510 };

// "The problem" / "The solution" de un caso de estudio + tarjetas con las pantallas clave.
// Animación en case/useCaseIntroReveal.ts. Estilos: styles/sections/_case-intro.scss
export default function CaseIntro({ textKey, slug, images }: Props) {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const problem = t(`${textKey}.problem`, { returnObjects: true }) as Block;
  const solution = t(`${textKey}.solution`, { returnObjects: true }) as Block;
  const cards = t(`${textKey}.cards`, { returnObjects: true }) as Card[];

  useFitWord(root, ".case-intro__bg-word");
  useCaseIntroReveal(root);

  return (
    <section className="case-intro" ref={root} aria-labelledby="case-problem-title">

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
            </div>
          ))}
        </div>

        <div className="case-intro__showcase">
          <span className="case-intro__bg-word" aria-hidden="true">
            {t(`${textKey}.backgroundWord`)}
          </span>
          <div className="case-intro__orb" aria-hidden="true">
            <MeshGradient circles={ORB} />
          </div>

          <ul className="case-intro__cards">
            {cards.map((card, index) => (
              <li key={images[index]} className="case-intro__item">
                {/* La entrada mueve el <li>; el hover, la tarjeta: cada animación en su propio elemento. */}
                <div className="case-intro__card">
                  <h3 className="case-intro__card-title">{card.title}</h3>
                  <p className="case-intro__card-text">{card.text}</p>
                  <img
                    className="case-intro__card-image"
                    src={`/images/case/${slug}/${images[index]}.png`}
                    alt={card.alt}
                    {...IMAGE_SIZE}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

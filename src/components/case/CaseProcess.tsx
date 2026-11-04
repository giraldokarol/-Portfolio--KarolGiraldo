import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { useCaseProcessReveal } from "./useCaseProcessReveal";

// Foto de fondo de una etapa: public/images/case/<slug>/<image>.png. tone = cómo es la foto, para que el
// texto se lea encima: "dark" → texto blanco sobre velo oscuro; "light" → texto negro sobre velo blanco.
export type ProcessStep = { image: string; width: number; height: number; tone: "dark" | "light" };

type StepText = { number: string; title: string; text: string; alt: string };

type Props = {
  // Clave de los textos en locales/*/common.json (p. ej. "cases.interfaceWebApp.process").
  textKey: string;
  slug: string;
  // Una por etapa, en el mismo orden que <textKey>.steps.
  steps: readonly ProcessStep[];
};

// "Process" de un caso de estudio: tres etapas en columnas. Al pasar el ratón por una (o, en pantallas
// táctiles, al llegar a ella con el scroll) aparece su foto de fondo de abajo hacia arriba.
// La foto la descubre el CSS (hover / .is-active); la clase la pone case/useCaseProcessReveal.ts en táctil.
// Estilos: styles/sections/_case-process.scss
export default function CaseProcess({ textKey, slug, steps }: Props) {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const texts = t(`${textKey}.steps`, { returnObjects: true }) as StepText[];

  useCaseProcessReveal(root);

  return (
    <section className="case-process" ref={root} aria-labelledby="case-process-title">
      <div className="case-process__inner container">
        <span className="case-process__label" aria-hidden="true">
          {t(`${textKey}.label`)}
        </span>
        <h2 id="case-process-title" className="case-process__title">
          {t(`${textKey}.title`)}
        </h2>
        <p className="case-process__lead">{t(`${textKey}.lead`)}</p>

        <ol className="case-process__steps">
          {steps.map((step, index) => {
            const text = texts[index];
            return (
              <li key={step.image} className={`case-process__step case-process__step--${step.tone}`}>
                {/* Foto + velo para que el texto se lea; el recorte (object-fit) se adapta al tamaño. */}
                <div className="case-process__media">
                  <img
                    className="case-process__image"
                    src={`/images/case/${slug}/${step.image}.png`}
                    alt={text.alt}
                    width={step.width}
                    height={step.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="case-process__content">
                  <span className="case-process__number" aria-hidden="true">
                    {text.number}
                  </span>
                  <h3 className="case-process__step-title">{text.title}</h3>
                  <p className="case-process__step-text">{text.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

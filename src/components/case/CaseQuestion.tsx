import { useRef } from "react";
import { Trans } from "react-i18next";

import MeshOrb, { type OrbPlacement } from "./MeshOrb";
import { useCaseQuestionReveal } from "./useCaseQuestionReveal";

type Props = {
  // Clave de los textos en locales/*/common.json (p. ej. "cases.interfaceWebApp.question").
  textKey: string;
};

// Bolitas de color (MeshOrb): grande tras el principio de la frase, pequeña arriba a la izquierda y otra
// pequeña junto al final. Centro (x, y) en % de la sección y diámetro en vw, medidos sobre el diseño.
// Móvil: grande tras el texto, pequeñas en las esquinas.
const ORBS: { desktop: OrbPlacement; mobile: OrbPlacement }[] = [
  { desktop: { x: 30, y: 47, size: 24.6 }, mobile: { x: 30, y: 34, size: 56 } },
  { desktop: { x: 16.5, y: 22, size: 6.9 }, mobile: { x: 86, y: 9, size: 16 } },
  { desktop: { x: 80.4, y: 83, size: 6.9 }, mobile: { x: 82, y: 93, size: 18 } },
];

// "How might we…": la pregunta que guía el diseño, en grande y con la parte clave en gris.
// Animación en case/useCaseQuestionReveal.ts. Estilos: styles/sections/_case-question.scss
export default function CaseQuestion({ textKey }: Props) {
  const root = useRef<HTMLElement>(null);

  useCaseQuestionReveal(root);

  return (
    <section className="case-question" ref={root} aria-labelledby="case-question-title">
      {ORBS.map(({ desktop, mobile }) => (
        <MeshOrb key={`${desktop.x}-${desktop.y}`} className="case-question__orb" {...desktop} mobile={mobile} />
      ))}

      <div className="case-question__inner container">
        <h2 id="case-question-title" className="case-question__title">
          {/* <muted> = la parte clave de la pregunta, en gris. */}
          <Trans i18nKey={`${textKey}.text`} components={{ muted: <span className="case-question__muted" /> }} />
        </h2>
      </div>
    </section>
  );
}

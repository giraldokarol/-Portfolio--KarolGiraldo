import { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";

import MeshGradient, { type MeshCircle } from "../MeshGradient";
import MeshOrb, { type OrbPlacement } from "./MeshOrb";
import { useCaseContextReveal } from "./useCaseContextReveal";

type Props = {
  // Clave de los textos en locales/*/common.json (p. ej. "cases.interfaceWebApp.context").
  textKey: string;
  // Bolitas de color (MeshOrb) repartidas por la sección en lugar del círculo junto al título:
  // centro en % de la sección y diámetro en vw.
  orbs?: (OrbPlacement & { mobile?: OrbPlacement })[];
  // Botones opcionales bajo la entradilla, a webs externas (se abren en otra pestaña). Texto: <textKey>.cta.<key>.
  links?: { key: string; href: string }[];
};

// Un solo círculo que llena su caja (posición y radio en fracción de la caja).
const ORB: MeshCircle[] = [{ x: 0.5, y: 0.5, r: 0.5 }];

// "(Context)" de un caso de estudio: una frase grande que sitúa el proyecto y una entradilla.
// Animación en case/useCaseContextReveal.ts. Estilos: styles/sections/_case-context.scss
export default function CaseContext({ textKey, orbs, links }: Props) {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);

  useCaseContextReveal(root);

  return (
    <section className="case-context" ref={root} aria-labelledby="case-context-title">
      {orbs?.map(({ mobile, ...desktop }) => (
        <MeshOrb key={`${desktop.x}-${desktop.y}`} className="case-context__mesh-orb" {...desktop} mobile={mobile} />
      ))}

      <div className="case-context__inner container">
        <p className="case-context__label">{t(`${textKey}.label`)}</p>
        {/* El círculo se coloca respecto al título: siempre junto a su final, sea cual sea el idioma. */}
        <div className="case-context__heading">
          <h2 id="case-context-title" className="case-context__title">
            {t(`${textKey}.title`)}
          </h2>
          {!orbs && (
            <div className="case-context__orb" aria-hidden="true">
              <MeshGradient circles={ORB} />
            </div>
          )}
        </div>
        <p className="case-context__lead">
          {/* <strong> = nombre del producto en negrita. */}
          <Trans i18nKey={`${textKey}.lead`} components={{ strong: <strong /> }} />
        </p>
        {links && (
          <div className="case-context__ctas">
            {links.map(({ key, href }) => (
              <a key={key} className="btn btn--primary case-context__cta" href={href} target="_blank" rel="noopener noreferrer">
                {t(`${textKey}.cta.${key}`)}
                <span className="case-context__cta-hint">{` ${t("a11y.newTab")}`}</span>
                <svg className="case-context__cta-arrow" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

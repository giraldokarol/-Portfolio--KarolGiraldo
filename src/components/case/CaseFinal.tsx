import { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";

import { useCaseFinalReveal } from "./useCaseFinalReveal";

type Stat = { value: string; label: string };

type Props = {
  // Clave de los textos en locales/*/common.json (p. ej. "cases.interfaceWebApp.final").
  textKey: string;
  // Archivos en public/images/case/<slug>/: final-photo.png y flexis-logo.svg.
  slug: string;
  photo: { width: number; height: number };
};

// "Final Thoughts" de un caso de estudio: bento de tarjetas blancas (foto, resultado, frase, cliente,
// cifras y resumen). El orden del HTML es el de lectura; la rejilla (grid-template-areas) las coloca.
// Animación en case/useCaseFinalReveal.ts. Estilos: styles/sections/_case-final.scss
export default function CaseFinal({ textKey, slug, photo }: Props) {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const stats = t(`${textKey}.stats`, { returnObjects: true }) as Stat[];

  useCaseFinalReveal(root);

  return (
    <section className="case-final" ref={root} aria-labelledby="case-final-title">
      <div className="case-final__inner container">
        <div className="case-final__head">
          <span className="case-final__label" aria-hidden="true">
            {t(`${textKey}.label`)}
          </span>
          <h2 id="case-final-title" className="case-final__title">
            {t(`${textKey}.title`)}
          </h2>
        </div>

        <div className="case-final__bento">
          <h3 className="case-final__card case-final__card--outcome">{t(`${textKey}.outcome`)}</h3>

          <p className="case-final__card case-final__card--statement">
            {/* Un solo bloque de texto (la tarjeta centra con flex: sin él, cada trozo sería una pieza).
                <strong> = palabras en negrita del diseño. */}
            <span>
              <Trans i18nKey={`${textKey}.statement`} components={{ strong: <strong /> }} />
            </span>
          </p>

          {stats.map((stat, index) => (
            <p key={stat.label} className={`case-final__card case-final__card--stat case-final__card--stat-${index + 1}`}>
              <span className="case-final__stat-value">{stat.value}</span>
              <span className="case-final__stat-label">{stat.label}</span>
            </p>
          ))}

          <div className="case-final__card case-final__card--client">
            <p className="case-final__client-label">{t(`${textKey}.projectFor`)}</p>
            <img
              className="case-final__logo"
              src={`/images/case/${slug}/flexis-logo.svg`}
              alt={t(`${textKey}.logoAlt`)}
              width={246}
              height={66}
              loading="lazy"
            />
          </div>

          <div className="case-final__card case-final__card--photo">
            <img
              className="case-final__photo"
              src={`/images/case/${slug}/final-photo.png`}
              alt={t(`${textKey}.photoAlt`)}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="case-final__card case-final__card--summary">
            {/* Lápiz (icono de línea): se dibuja al aparecer. Decorativo. */}
            <svg className="case-final__pencil" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z" />
              <path d="m15 5 4 4" />
            </svg>
            <p className="case-final__summary">{t(`${textKey}.summary`)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

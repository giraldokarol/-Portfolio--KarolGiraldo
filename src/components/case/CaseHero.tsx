import { useRef, type CSSProperties } from "react";
import { Trans, useTranslation } from "react-i18next";

import { useBlobGradient, type BlobConfig } from "../useBlobGradient";
import { useCaseHeroDetails } from "./useCaseHeroDetails";
import { useCaseHeroReveal } from "./useCaseHeroReveal";
import { useCaseHeroScroll } from "./useCaseHeroScroll";

type Detail = { label: string; value: string };

type Props = {
  // Clave de los textos en locales/*/common.json (p. ej. "cases.interfaceWebApp.hero").
  textKey: string;
  // Carpeta del vídeo y su portada: public/videos/case/<slug>/hero.mp4 y hero.jpg.
  slug: string;
  // Marco del vídeo: ventana de navegador (web, por defecto) o teléfono (apps móviles).
  device?: "web" | "phone";
  // Proporción del vídeo (ancho / alto) en la ventana de navegador; por defecto, la del vídeo de Interface.
  videoRatio?: number;
};

// Manchas de color: las dos del Hero de la home y dos más a los lados.
const BLOBS: BlobConfig[] = [
  {
    selector: ".case-hero__blob--yellow",
    range: 0.3,
    lag: 0.9,
    drift: { x: 0.06, y: 0.05, duration: 9 },
  },
  {
    selector: ".case-hero__blob--blue",
    range: 0.22,
    lag: 1.3,
    drift: { x: -0.05, y: -0.06, duration: 11 },
  },
  {
    selector: ".case-hero__blob--yellow-side",
    range: 0.16,
    lag: 1.6,
    drift: { x: -0.04, y: 0.06, duration: 13 },
  },
  {
    selector: ".case-hero__blob--blue-side",
    range: 0.2,
    lag: 1.1,
    drift: { x: 0.05, y: -0.04, duration: 10 },
  },
];

// Hero de un caso de estudio: título, entradilla, vídeo en una ventana de navegador o en un teléfono
// (cortado por el borde de la pantalla al entrar; el resto aparece con el scroll) y ficha del proyecto.
// Animaciones en case/useCaseHeroReveal.ts (entrada) y case/useCaseHeroScroll.ts (scroll). Estilos: styles/sections/_case-hero.scss
export default function CaseHero({ textKey, slug, device = "web", videoRatio }: Props) {
  const { t, i18n } = useTranslation();
  // Nota opcional bajo el vídeo (p. ej. confidencialidad), solo si el caso la tiene.
  const note = i18n.exists(`${textKey}.note`) ? t(`${textKey}.note`) : null;
  const root = useRef<HTMLElement>(null);
  const details = t(`${textKey}.details`, { returnObjects: true }) as Detail[];

  useBlobGradient(root, BLOBS);
  useCaseHeroDetails(root);
  useCaseHeroReveal(root);
  useCaseHeroScroll(root);

  return (
    <section
      className={`case-hero case-hero--${device}`}
      ref={root}
      aria-labelledby="case-title"
      style={videoRatio ? ({ "--video-ratio": videoRatio } as CSSProperties) : undefined}
    >
      <div className="case-hero__backdrop" aria-hidden="true">
        <div className="blob blob--yellow case-hero__blob--yellow" />
        <div className="blob blob--blue case-hero__blob--blue" />
        <div className="blob blob--yellow case-hero__blob--yellow-side" />
        <div className="blob blob--blue case-hero__blob--blue-side" />
      </div>

      <div className="case-hero__inner container">
        <div className="case-hero__head">
          <div className="case-hero__heading">
            <h1 id="case-title" className="case-hero__title">
              {/* <accent> = palabras en azul; <br/> = salto de línea del diseño. */}
              <Trans
                i18nKey={`${textKey}.title`}
                components={{ accent: <span className="case-hero__accent" /> }}
              />
            </h1>
            <p className="case-hero__lead">{t(`${textKey}.lead`)}</p>
          </div>
        </div>

        <div className="case-hero__stage">
          {/* Ventana de navegador (o teléfono) con el vídeo del producto. El marco exterior crece con el scroll y la
              ventana hace la entrada: cada animación mueve su propio elemento y no se pisan. */}
          <div className="case-hero__frame">
            <div className="case-hero__window">
              {device === "web" && (
                <div className="case-hero__toolbar" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              )}
              <video
                className="case-hero__video"
                src={`/videos/case/${slug}/hero.mp4`}
                poster={`/videos/case/${slug}/hero.jpg`}
                aria-label={t(`${textKey}.videoLabel`)}
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>
            {note && <p className="case-hero__note">{note}</p>}
          </div>

          <dl
            className="case-hero__details"
            aria-label={t(`${textKey}.detailsLabel`)}
          >
            {details.map(({ label, value }) => (
              <div key={label} className="case-hero__detail">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

import { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Download } from "lucide-react";

import Portrait from "@/assets/img/portrait_karol.png";
import cvUrl from "@/assets/CV_KarolGiraldo_FR.pdf";
import MeshGradient, { type MeshCircle } from "./MeshGradient";
import { useAboutReveal } from "./about/useAboutReveal";

// <Trans> convierte el <strong> escrito dentro del JSON en negrita real.
const richText = { strong: <strong /> };

// Las tres "bolitas" del fondo con el degradado de malla animado (igual que en Selected work).
// Posición y radio en fracción del ancho/alto de la sección (medidos sobre el diseño).
const MESH_CIRCLES: MeshCircle[] = [
  { x: 0.158, y: 0.69, r: 0.132 },
  { x: 0.465, y: 0.306, r: 0.079 },
  { x: 0.865, y: 0.57, r: 0.079 },
];
// Móvil: grande detrás de la foto, pequeños junto al texto.
const MESH_CIRCLES_MOBILE: MeshCircle[] = [
  { x: 0.3, y: 0.24, r: 0.42 },
  { x: 0.92, y: 0.5, r: 0.2 },
  { x: 0.08, y: 0.86, r: 0.16 },
];

// Sección "Behind the work": la foto con su "selección de Figma" (aro y tiradores, como el avatar
// del Hero) y círculos de color a la izquierda; título, texto y CV a la derecha.
// Estilos: styles/sections/_about.scss · Entrada animada: about/useAboutReveal.ts
export default function About() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);

  useAboutReveal(root);

  return (
    <section id="about" className="about" aria-labelledby="about-title" ref={root}>
      <MeshGradient circles={MESH_CIRCLES} mobileCircles={MESH_CIRCLES_MOBILE} />

      <div className="about__inner container">
        {/* Composición decorativa: todo en % de esta caja, así escala junta en cualquier pantalla. */}
        <div className="about__media">
          <svg className="about__ring" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="49" />
          </svg>
          <span className="about__dot about__dot--blue" aria-hidden="true" />
          <span className="about__dot about__dot--yellow" aria-hidden="true" />
          <img src={Portrait} alt={t("about.portraitAlt")} className="about__portrait" />
          {/* Tiradores de selección, como en Figma: línea, cuadrado central y dos círculos con sombra amarilla. */}
          <svg className="about__handles" viewBox="0 0 200 24" aria-hidden="true">
            <line className="about__handles-line" x1="12" y1="12" x2="188" y2="12" />
            <rect className="about__handles-square" x="91" y="3" width="18" height="18" />
            <circle className="about__handles-shadow" cx="9" cy="15" r="7" />
            <circle className="about__handles-shadow" cx="185" cy="15" r="7" />
            <circle className="about__handles-knob" cx="12" cy="12" r="7" />
            <circle className="about__handles-knob" cx="188" cy="12" r="7" />
          </svg>
        </div>

        <div className="about__text">
          <h2 id="about-title" className="about__title">
            {t("about.title")}
          </h2>

          <div className="about__body">
            <p>
              <Trans i18nKey="about.paragraph1" components={richText} />
            </p>
            <p>
              <Trans i18nKey="about.paragraph2" components={richText} />
            </p>
          </div>

          <a href={cvUrl} download className="btn btn--primary about__cta">
            <Download size={18} aria-hidden="true" /> {t("cta.downloadCv")}
          </a>
        </div>
      </div>
    </section>
  );
}

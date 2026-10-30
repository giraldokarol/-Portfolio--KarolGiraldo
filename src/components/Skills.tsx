import { useRef } from "react";
import { useTranslation } from "react-i18next";

import MeshGradient, { type MeshCircle } from "./MeshGradient";
import { useSkillsPhysics } from "./skills/useSkillsPhysics";
import { SKILLS } from "@/config/site";

// Bolitas del degradado de fondo (fracción del ancho/alto del bloque, medidas sobre el diseño).
const MESH_CIRCLES: MeshCircle[] = [
  { x: 0.147, y: 0.42, r: 0.05 },
  { x: 0.773, y: 0.71, r: 0.043 },
  { x: 0.822, y: 0.27, r: 0.026 },
];
const MESH_CIRCLES_MOBILE: MeshCircle[] = [
  { x: 0.1, y: 0.3, r: 0.16 },
  { x: 0.9, y: 0.75, r: 0.14 },
  { x: 0.85, y: 0.15, r: 0.08 },
];

// Puntitos amarillos que caen con las píldoras (decorativos).
const DOTS = 6;

// Complemento de "Behind the work": las habilidades como píldoras que caen con gravedad,
// chocan y se amontonan (física real con Matter.js, ver skills/useSkillsPhysics.ts).
// Sin animaciones (o sin JavaScript) se ven como una lista de píldoras ordenada.
// Estilos: styles/sections/_skills.scss
export default function Skills() {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);

  useSkillsPhysics(root);

  return (
    <div className="skills" ref={root}>
      <MeshGradient circles={MESH_CIRCLES} mobileCircles={MESH_CIRCLES_MOBILE} />

      {/* Palabra gigante de fondo, como "Designer" en el Hero. */}
      <p className="skills__word" aria-hidden="true">
        {t("nav.behindTheWork")}
      </p>

      <h3 className="skills__title">{t("skills.title")}</h3>

      <div className="skills__arena">
        <ul className="skills__list">
          {SKILLS.map(({ id, filled }) => (
            <li key={id} className={`skills__pill ${filled ? "skills__pill--filled" : ""}`}>
              {t(`skills.items.${id}`)}
            </li>
          ))}
        </ul>
        {Array.from({ length: DOTS }, (_, i) => (
          <span key={i} className="skills__dot" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}

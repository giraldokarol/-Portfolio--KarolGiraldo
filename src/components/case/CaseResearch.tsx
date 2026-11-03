import { useRef, type CSSProperties } from "react";
import { Trans, useTranslation } from "react-i18next";

import { useCaseResearchReveal } from "./useCaseResearchReveal";

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
export type ResearchGap = {
  stage: { x: number; w: number; ratio: number; mobileRatio: number };
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
// Animación en case/useCaseResearchReveal.ts. Estilos: styles/sections/_case-research.scss
export default function CaseResearch({ textKey, slug, gaps }: Props) {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const texts = t(`${textKey}.gaps`, { returnObjects: true }) as GapText[];
  const roles = t(`${textKey}.roles`, { returnObjects: true }) as Record<string, RoleText>;

  useCaseResearchReveal(root);

  return (
    <section className="case-research" ref={root} aria-labelledby="case-research-title">
      <div className="case-research__inner container">
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

        <ol className="case-research__gaps" aria-label={t(`${textKey}.gapsLabel`)}>
          {gaps.map((gap, index) => {
            const text = texts[index];
            const stageStyle = {
              "--stage-x": `${gap.stage.x}%`,
              "--stage-w": `${gap.stage.w}%`,
              "--ratio": gap.stage.ratio,
              "--ratio-sm": gap.stage.mobileRatio,
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
      </div>
    </section>
  );
}

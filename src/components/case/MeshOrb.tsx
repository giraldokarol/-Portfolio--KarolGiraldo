import type { CSSProperties } from "react";

import MeshGradient, { type MeshCircle } from "../MeshGradient";

// Centro (x, y) en % de su contenedor y diámetro en vw.
export type OrbPlacement = { x: number; y: number; size: number };

type Props = OrbPlacement & {
  // Otra posición y tamaño en pantallas pequeñas (< 1024 px). Sin ella, la misma que en escritorio.
  mobile?: OrbPlacement;
  className?: string;
};

// La bolita grande de "Selected work" (home), en la misma posición de su caja que en la home.
const HOME_CIRCLE: MeshCircle[] = [{ x: 0.327, y: 0.36, r: 0.139 }];

// Bolita de color con el degradado de malla de la home, colocada donde se quiera.
// El degradado mezcla los colores alrededor de un punto fijo de su caja: por eso cada bolita tiene su
// propia caja del tamaño de la sección de la home, con el círculo donde está allí; así mezcla los tres
// colores igual que en la home, esté donde esté. Decorativa. Estilos: styles/components/_mesh-orb.scss
export default function MeshOrb({ x, y, size, mobile = { x, y, size }, className = "" }: Props) {
  const style = {
    "--orb-x": `${x}%`,
    "--orb-y": `${y}%`,
    "--orb-size": `${size}vw`,
    "--orb-x-sm": `${mobile.x}%`,
    "--orb-y-sm": `${mobile.y}%`,
    "--orb-size-sm": `${mobile.size}vw`,
  } as CSSProperties;

  return (
    <div className={`mesh-orb ${className}`} style={style} aria-hidden="true">
      <MeshGradient circles={HOME_CIRCLE} />
    </div>
  );
}

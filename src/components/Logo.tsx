import LogoText from "@/assets/img/logo-karolg.svg";
import LogoPoint from "@/assets/img/logo-point.svg";

// Logo de Figma ("Text Blue Logo"): el texto "karolg" + el punto amarillo superpuesto.
// El nombre accesible lo da el enlace que envuelve al logo, por eso alt="".
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <img src={LogoText} alt="" width={117.092} height={47.9943} className="logo__text" />
      <img src={LogoPoint} alt="" width={9.39408} height={8.77289} className="logo__point" />
    </span>
  );
}

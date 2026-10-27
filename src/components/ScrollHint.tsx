// Icono de "haz scroll": mouse con la ruedita bajando en bucle.
// SVG + animación CSS (styles/sections/_hero.scss): sustituye a Lottie, que pesaba cientos de KB.
// Con reduced-motion la ruedita se queda quieta.
export default function ScrollHint() {
  return (
    <svg className="scroll-hint" width="36" height="56" viewBox="0 0 36 56" fill="none" aria-hidden="true">
      <rect className="scroll-hint__body" x="1.5" y="1.5" width="33" height="53" rx="16.5" />
      <line className="scroll-hint__wheel" x1="18" y1="12" x2="18" y2="19" />
    </svg>
  );
}

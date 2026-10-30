// Flecha de enlaces y botones ("Say Hello", listas de proyectos). Toma el color del texto
// (currentColor), así cambia con el hover. Decorativa: el texto del enlace ya dice adónde lleva.
export default function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15.6 15L18.6 12L15.6 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
      <path d="M4.59999 12H18.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
    </svg>
  );
}

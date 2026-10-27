// Datos que no se traducen (nombres propios, URLs, email).

// PENDIENTE: poner el dominio real cuando se elija el hosting.
// Google exige URLs absolutas en canonical y hreflang.
export const SITE_URL = "https://karolgiraldo.com";

export const CONTACT_EMAIL = "karol.giraldo9505@gmail.com";

export const LINKEDIN_URL = "https://www.linkedin.com/in/karol-giraldo-escobar/";

export const SOCIAL_LINKS = [
  { label: "Behance", href: "https://www.behance.net/karolGiraldoFrames" },
  { label: "Figma Community", href: "https://www.figma.com/@giraldokarol" },
  { label: "LinkedIn", href: LINKEDIN_URL },
] as const;

// Enlaces del menú: id de la sección destino + clave de su texto en locales/*/common.json → nav.
export const NAV_LINKS = [
  { section: "projects", label: "selectedWork" },
  { section: "about", label: "behindTheWork" },
] as const;
export type NavSection = (typeof NAV_LINKS)[number]["section"];

// Destino del botón "Say Hello" (id del footer).
export const CONTACT_SECTION = "contact";

// Datos que no se traducen (nombres propios, URLs, email).

// PENDIENTE: poner el dominio real cuando se elija el hosting.
// Google exige URLs absolutas en canonical y hreflang.
export const SITE_URL = "https://karolgiraldo.com";

export const CONTACT_EMAIL = "karol.giraldo9505@gmail.com";

const LINKEDIN_URL = "https://www.linkedin.com/in/karol-giraldo-escobar/";

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

// id de la sección del hero (Hero.tsx): al volver a ella, el menú se desmarca y la URL queda sin #.
export const HERO_SECTION = "home";

// Destino del botón "Say Hello" (id de la sección de contacto, components/Contact.tsx).
export const CONTACT_SECTION = "contact";

// Proyectos de "Selected work", en orden. Los nombres están en locales/*/common.json → work.items.
// frame: forma del marco central (teléfono o web).
// slug: futura página del caso de estudio (/:lang/work/:slug). PENDIENTE: aún no existen esas páginas.
export const WORK_PROJECTS = [
  { id: "driverApp", frame: "mobile", slug: "driver-app" },
  { id: "interface", frame: "web", slug: "interface" },
  { id: "cmcic", frame: "web", slug: "credit-mutuel-cic" },
  { id: "tulindero", frame: "web", slug: "tulindero" },
] as const;
export type WorkProject = (typeof WORK_PROJECTS)[number];

// Habilidades de "Behind the work" (píldoras con física, components/Skills.tsx). Textos: skills.items.<id>.
// filled = píldora azul rellena (las que más destacan); el resto, con contorno.
export const SKILLS = [
  { id: "userResearch", filled: false },
  { id: "designSystems", filled: true },
  { id: "componentDocumentation", filled: false },
  { id: "crossFunctional", filled: true },
  { id: "designToCode", filled: false },
  { id: "informationArchitecture", filled: false },
  { id: "accessibility", filled: false },
  { id: "codePrototyping", filled: false },
  { id: "htmlCssSass", filled: true },
  { id: "usabilityTesting", filled: true },
  { id: "componentLibraries", filled: false },
  { id: "agile", filled: false },
  { id: "vibeCoding", filled: false },
  { id: "businessRequirements", filled: false },
  { id: "stakeholders", filled: true },
] as const;

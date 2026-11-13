// Datos que no se traducen (nombres propios, URLs, email).
// Sin atajos "@/" ni código de navegador: también lo leen el build (react-router.config.ts) y el sitemap.
import type { Locale } from "../i18n/locales.ts";

// Dominio del sitio (comprado en Hostinger). Si cambia, cambiarlo también en public/.htaccess.
// Google exige URLs absolutas en canonical y hreflang.
export const SITE_URL = "https://karolgiraldoescobar.com";

export const CONTACT_EMAIL = "karol.giraldo9505@gmail.com";

const LINKEDIN_URL = "https://www.linkedin.com/in/karol-giraldo-escobar/";

export const SOCIAL_LINKS = [
  { label: "Behance", href: "https://www.behance.net/karolGiraldoFrames" },
  { label: "Figma Community", href: "https://www.figma.com/@giraldokarol" },
  { label: "LinkedIn", href: LINKEDIN_URL },
] as const;

// Secciones de la home con enlace (#): cada idioma tiene su propio id, igual que el texto del menú
// (/en#selected-work, /fr#etudes-de-cas, /es#casos-de-estudio). En el código se usa la clave (projects…).
export const SECTION_IDS = {
  projects: { en: "selected-work", fr: "etudes-de-cas", es: "casos-de-estudio" },
  about: { en: "behind-the-work", fr: "mon-parcours", es: "mi-trayectoria" },
  contact: { en: "contact", fr: "contact", es: "contacto" },
} as const satisfies Record<string, Record<Locale, string>>;
export type Section = keyof typeof SECTION_IDS;

// id de una sección en un idioma: sectionId("projects", "fr") → "etudes-de-cas".
export const sectionId = (section: Section, locale: Locale) => SECTION_IDS[section][locale];

// Sección a la que apunta un # en cualquier idioma, o con los ids antiguos (#projects, #about, #contact),
// para que los enlaces compartidos antes sigan funcionando.
export function findSection(hash: string): Section | null {
  const keys = Object.keys(SECTION_IDS) as Section[];
  return keys.find((key) => key === hash || Object.values(SECTION_IDS[key]).includes(hash as never)) ?? null;
}

// Enlaces del menú: sección destino (clave de SECTION_IDS) + clave de su texto en locales/*/common.json → nav.
export const NAV_LINKS = [
  { section: "projects", label: "selectedWork" },
  { section: "about", label: "behindTheWork" },
] as const;
export type NavSection = (typeof NAV_LINKS)[number]["section"];

// id de la sección del hero (Hero.tsx): al volver a ella, el menú se desmarca y la URL queda sin #.
export const HERO_SECTION = "home";

// Destino del botón "Say Hello" (sección de contacto, components/Contact.tsx).
export const CONTACT_SECTION = "contact" as const;

// Caso Crédit Mutuel & CIC: botones a la web pública de cada banco, con la nueva marca.
// key = texto del botón en cases.creditMutuelCic.context.cta.<key>.
export const CM_CIC_PUBLIC_SITES = [
  { key: "cm", href: "https://www.creditmutuel.fr/fr/particuliers.html" },
  { key: "cic", href: "https://www.cic.fr/fr/particuliers.html" },
];

// Proyectos de "Selected work", en orden. Los nombres están en locales/*/common.json → work.items.
// frame: forma del marco central (teléfono o web).
// slug: página del caso de estudio (projectPath: /en/selected-work/driver-app, /fr/etudes-de-cas/driver-app…).
export const WORK_PROJECTS = [
  { id: "driverApp", frame: "mobile", slug: "driver-app" },
  { id: "interface", frame: "web", slug: "interface-web-app" },
  { id: "cmcic", frame: "web", slug: "credit-mutuel-cic" },
] as const;
export type WorkProject = (typeof WORK_PROJECTS)[number];

// ─── Direcciones de las páginas, en el idioma de cada una ─────────────────────────────
// Los casos de estudio cuelgan de la sección "Selected work" con su nombre en cada idioma
// (el mismo id que la sección: SECTION_IDS.projects) y la página legal tiene el suyo.
export const LEGAL_SLUGS = { en: "legal", fr: "mentions-legales", es: "aviso-legal" } as const satisfies Record<
  Locale,
  string
>;

export const homePath = (locale: Locale) => `/${locale}`;
export const legalPath = (locale: Locale) => `/${locale}/${LEGAL_SLUGS[locale]}`;
export const projectPath = (locale: Locale, slug: string) => `/${locale}/${SECTION_IDS.projects[locale]}/${slug}`;

// Todas las páginas, como "dirección según el idioma": las usan el prerender (react-router.config.ts),
// el sitemap (scripts/seo-files.mjs) y el hreflang de cada página (i18n/seo.ts).
export const PAGE_PATHS: ((locale: Locale) => string)[] = [
  homePath,
  legalPath,
  ...WORK_PROJECTS.map(({ slug }) => (locale: Locale) => projectPath(locale, slug)),
];

// Direcciones antiguas o con la palabra de otro idioma → la correcta (o null si no se reconoce):
// /es/work/driver-app y /es/selected-work/driver-app → /es/casos-de-estudio/driver-app · /fr/legal → /fr/mentions-legales.
// En Hostinger lo hace también el .htaccess (con código 301); esto cubre el resto (y el modo desarrollo).
export function fixPath(pathname: string): string | null {
  const [, lang, page, slug] = pathname.replace(/\/$/, "").split("/");
  if (!(lang in LEGAL_SLUGS)) return null;
  const locale = lang as Locale;
  const projectWords = ["work", ...Object.values(SECTION_IDS.projects)];
  if (slug && projectWords.includes(page) && WORK_PROJECTS.some((project) => project.slug === slug)) {
    return projectPath(locale, slug);
  }
  if (!slug && (Object.values(LEGAL_SLUGS) as string[]).includes(page)) return legalPath(locale);
  return null;
}

// La misma página en otro idioma (selector de idioma del footer):
// "/es/casos-de-estudio/driver-app" → "/fr/etudes-de-cas/driver-app"; si no se reconoce, el inicio.
export function translatePath(pathname: string, target: Locale): string {
  const from = pathname.split("/")[1];
  if (!(from in LEGAL_SLUGS)) return homePath(target);
  const page = PAGE_PATHS.find((pathFor) => pathFor(from as Locale) === pathname.replace(/\/$/, ""));
  return page ? page(target) : homePath(target);
}

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

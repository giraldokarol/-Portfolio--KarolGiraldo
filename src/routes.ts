import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // "/" detecta el idioma del visitante y lo lleva a /en, /fr o /es.
  index("routes/language-redirect.tsx"),
  // Una página por idioma; el idioma sale de la URL (:lang).
  route(":lang", "routes/home.tsx"),
] satisfies RouteConfig;

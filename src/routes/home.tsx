import { data } from "react-router";

import { isLocale } from "@/i18n/config";
import { i18nByLocale } from "@/i18n/instances";
import { alternateLinks } from "@/i18n/seo";
import Header from "@/components/Header";
import SocialRail from "@/components/SocialRail";
import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import About from "@/components/About";
import Footer from "@/components/Footer";
import type { Route } from "./+types/home";

// Corre en el build (prerender): una URL como /de no es un idioma válido → 404.
export function loader({ params }: Route.LoaderArgs) {
  if (!isLocale(params.lang)) throw data(null, { status: 404 });
  return { locale: params.lang };
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) return [];
  const { locale } = loaderData;
  const { t } = i18nByLocale[locale];

  return [
    { title: t("seo.title") },
    { name: "description", content: t("seo.description") },
    ...alternateLinks(locale),
  ];
};

export default function Home() {
  return (
    <>
      <Header />
      {/* Las redes acompañan al contenido y se quedan en la última sección: nunca pisan el footer. */}
      <div className="page-body">
        <SocialRail />
        <main id="main">
          <Hero />
          <SelectedWork />
          <About />
        </main>
      </div>
      <Footer />
    </>
  );
}

import { useEffect, useRef } from "react";
import { data } from "react-router";

import { ScrollTrigger } from "@/lib/gsap";

import { isLocale } from "@/i18n/config";
import { i18nByLocale } from "@/i18n/instances";
import { alternateLinks } from "@/i18n/seo";
import Header from "@/components/Header";
import SocialRail from "@/components/SocialRail";
import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import About from "@/components/About";
import Contact from "@/components/Contact";
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
  // Al llegar desde otra página con una sección (/es#about): se lee aquí, en el primer render, porque
  // el header borra el # de la URL al cargar. Las secciones fijadas con scroll cambian la altura de la
  // página al montarse, así que el salto se hace cuando GSAP ya ha colocado todo.
  const target = useRef(typeof window === "undefined" ? "" : window.location.hash.slice(1));

  useEffect(() => {
    const id = target.current;
    if (!id) return;
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
      document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    }, 400);
    return () => window.clearTimeout(timer);
  }, []);

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
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
}

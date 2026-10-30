import { useRef } from "react";
import { data } from "react-router";
import { Trans, useTranslation } from "react-i18next";

import { isLocale } from "@/i18n/config";
import { i18nByLocale } from "@/i18n/instances";
import { alternateLinks } from "@/i18n/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useBlobGradient } from "@/components/useBlobGradient";
import { CONTACT_EMAIL } from "@/config/site";
import type { Route } from "./+types/legal";

type LegalSection = { id: string; title: string; paragraphs: string[] };

// Corre en el build (prerender): un idioma que no existe → 404.
export function loader({ params }: Route.LoaderArgs) {
  if (!isLocale(params.lang)) throw data(null, { status: 404 });
  return { locale: params.lang };
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  if (!loaderData) return [];
  const { locale } = loaderData;
  const { t } = i18nByLocale[locale];

  return [
    { title: t("legal.seoTitle") },
    { name: "description", content: t("legal.seoDescription") },
    ...alternateLinks(locale, "/legal"),
  ];
};

// Mentions légales & confidentialité. Textos en locales (legal.*); el francés es la versión de referencia.
// Estilos: styles/pages/_legal.scss
export default function Legal() {
  const { t } = useTranslation();
  const intro = useRef<HTMLElement>(null);
  const sections = t("legal.sections", { returnObjects: true }) as LegalSection[];

  useBlobGradient(intro); // las manchas de color del Hero, también aquí

  // <mail> y <cnil> dentro de los textos se convierten en enlaces reales.
  const links = {
    mail: <a href={`mailto:${CONTACT_EMAIL}`} />,
    cnil: <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" />,
  };

  return (
    <>
      <Header />
      <main id="main" className="legal">
        <div className="legal__inner container">
          {/* Título con las manchas de color del Hero (misma línea gráfica). */}
          <header className="legal__intro" ref={intro}>
            <div className="blob blob--yellow legal__blob--yellow" aria-hidden="true" />
            <div className="blob blob--blue legal__blob--blue" aria-hidden="true" />
            <h1 className="legal__title">{t("legal.title")}</h1>
            <p className="legal__updated">{t("legal.updated")}</p>
          </header>

          {sections.map((section, s) => (
            <section key={section.id} id={section.id} className="legal__section" aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`} className="legal__heading">
                {section.title}
              </h2>
              {section.paragraphs.map((_, p) => (
                <p key={p} className="legal__text">
                  <Trans i18nKey={`legal.sections.${s}.paragraphs.${p}`} values={{ email: CONTACT_EMAIL }} components={links} />
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
